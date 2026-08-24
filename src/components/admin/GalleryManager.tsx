"use client";

import { useRef, useState } from "react";
import {
  Plus,
  PencilSimple,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import type { GalleryCategory, GalleryImageRecord } from "@/types/gallery";
import { GALLERY_CATEGORIES } from "@/types/gallery";
import { CategoryDropdown } from "@/components/admin/CategoryDropdown";

// Cloudinary's free-tier per-file ceiling is 100MB — this is a client-side
// sanity check, not the real enforcement point (Cloudinary itself is the
// backstop). Large files upload directly to Cloudinary from the browser,
// so Vercel's serverless request-body limit never comes into play here.
const MAX_FILE_SIZE_MB = 100;

interface UploadSignature {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
}

function uploadToCloudinary(
  file: File,
  sig: UploadSignature,
  onProgress: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    // XMLHttpRequest instead of fetch specifically because fetch has no
    // cross-browser-reliable way to report upload progress — needed here
    // since video files can take a while.
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Unexpected response from Cloudinary."));
        }
      } else {
        reject(new Error("Upload to Cloudinary failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload to Cloudinary failed."));
    xhr.send(formData);
  });
}

export function GalleryManager({
  initialImages,
}: {
  initialImages: GalleryImageRecord[];
}) {
  const [images, setImages] = useState(initialImages);
  const [isAdding, setIsAdding] = useState(false);

  // --- Add form state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<GalleryCategory>(
    GALLERY_CATEGORIES[0]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Edit modal state
  const [editingImage, setEditingImage] = useState<GalleryImageRecord | null>(
    null
  );
  const [editAlt, setEditAlt] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>(
    GALLERY_CATEGORIES[0]
  );
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetAddForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setAlt("");
    setCategory(GALLERY_CATEGORIES[0]);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (selected: File | null) => {
    setUploadError(null);
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !alt.trim()) {
      setUploadError("Please choose a photo or video and enter a description.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // 1. Get a short-lived signature from our own server.
      const sigRes = await fetch("/api/admin/gallery/upload-signature", {
        method: "POST",
      });
      const sigData = await sigRes.json();
      if (!sigRes.ok) {
        setUploadError(sigData.error || "Could not start upload. Please try again.");
        return;
      }

      // 2. Upload the actual file straight to Cloudinary from the browser.
      const uploaded = await uploadToCloudinary(file, sigData, setUploadProgress);

      // 3. Persist just the resulting metadata in Neon.
      const saveRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: uploaded.secure_url,
          public_id: uploaded.public_id,
          alt: alt.trim(),
          category,
          resource_type: uploaded.resource_type,
        }),
      });
      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        setUploadError(
          saveData.error || "Upload succeeded but saving failed. Please try again."
        );
        return;
      }

      setImages((prev) => [saveData.image, ...prev]);
      resetAddForm();
      setIsAdding(false);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const openEdit = (image: GalleryImageRecord) => {
    setEditingImage(image);
    setEditAlt(image.alt);
    setEditCategory(image.category);
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;
    setIsSavingEdit(true);

    try {
      const res = await fetch(`/api/admin/gallery/${editingImage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: editAlt.trim(), category: editCategory }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save changes.");
        return;
      }

      setImages((prev) =>
        prev.map((img) => (img.id === editingImage.id ? data.image : img))
      );
      setEditingImage(null);
    } catch {
      alert("Failed to save changes.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item? This can't be undone.")) return;

    setDeletingId(id);
    const previous = images;
    setImages((prev) => prev.filter((img) => img.id !== id));

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch {
      setImages(previous);
      alert("Failed to delete item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const isVideoFile = file?.type.startsWith("video/");

  return (
    <div>
      {/* Add button / form toggle */}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          style={{ padding: "12px 24px" }}
          className="inline-flex items-center gap-x-2 rounded-xl bg-primary text-white text-sm font-bold transition-colors hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Photo or Video
        </button>
      ) : (
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-3xl border border-gray-100 p-6"
          style={{ marginBottom: "32px" }}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: "24px" }}
          >
            <p className="font-bold text-slate-800">Add a new photo or video</p>
            <button
              type="button"
              onClick={() => {
                resetAddForm();
                setIsAdding(false);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-600"
              aria-label="Cancel"
            >
              <X className="w-5 h-5" weight="bold" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File picker / preview */}
            <div>
              <label className="block font-bold text-[13px] text-slate-600/90 mb-2">
                PHOTO OR VIDEO
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="relative flex h-48 w-full flex-col items-center justify-center gap-y-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-slate-400 transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
              >
                {previewUrl ? (
                  isVideoFile ? (
                    <video
                      src={previewUrl}
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )
                ) : (
                  <>
                    <UploadSimple className="w-8 h-8" weight="bold" />
                    <span className="text-xs font-bold">
                      Click to choose a photo or video
                    </span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) =>
                  handleFileSelect(e.target.files?.[0] ?? null)
                }
              />
            </div>

            {/* Alt text + category */}
            <div className="flex flex-col gap-y-5">
              <div>
                <label className="block font-bold text-[13px] text-slate-600/90 mb-2">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="e.g. Reception area"
                  style={{ padding: "12px 16px" }}
                  className="w-full rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block font-bold text-[13px] text-slate-600/90 mb-2">
                  CATEGORY
                </label>
                <CategoryDropdown value={category} onChange={setCategory} />
              </div>
            </div>
          </div>

          {isUploading && (
            <div style={{ marginTop: "20px" }}>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-primary transition-[width]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Uploading… {uploadProgress}%
              </p>
            </div>
          )}

          {uploadError && (
            <p
              className="text-sm font-medium text-red-500"
              style={{ marginTop: "16px" }}
            >
              {uploadError}
            </p>
          )}

          <button
            type="submit"
            disabled={isUploading}
            style={{ padding: "12px 32px", marginTop: "24px" }}
            className="inline-flex items-center gap-x-2 rounded-xl bg-primary text-white text-sm font-bold transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}

      {/* Existing items grid */}
      {images.length === 0 ? (
        <div
          className="bg-white rounded-3xl p-10 border border-gray-100 text-center"
          style={{ marginTop: "32px" }}
        >
          <p className="text-slate-800/60 text-sm">
            Nothing here yet — add your first photo or video above.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ marginTop: "32px" }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gray-100 bg-gray-50"
            >
              {image.resource_type === "video" ? (
                <video
                  src={image.src}
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                {image.category}
              </span>
              {/* Always-visible controls (not hover-reveal) — a
                  group-hover overlay never becomes reachable on
                  touchscreens, since there's no persistent hover state
                  on mobile. */}
              <div className="absolute top-3 right-3 flex flex-col gap-y-2">
                <button
                  type="button"
                  onClick={() => openEdit(image)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:text-primary"
                  aria-label="Edit"
                >
                  <PencilSimple className="w-4 h-4" weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:text-red-500 disabled:opacity-60"
                  aria-label="Delete"
                >
                  <Trash className="w-4 h-4" weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal — capped to viewport height with internal scroll, and
          a visible margin top/bottom so it never spans edge-to-edge */}
      {editingImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEditingImage(null)}
        >
          <div
            className="w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6"
            style={{ maxHeight: "calc(100vh - 64px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: "24px" }}
            >
              <p className="font-bold text-slate-800">Edit item</p>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 transition-colors hover:bg-gray-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" weight="bold" />
              </button>
            </div>

            {editingImage.resource_type === "video" ? (
              <video
                src={editingImage.src}
                muted
                playsInline
                controls
                className="h-40 w-full rounded-2xl object-cover"
                style={{ marginBottom: "20px" }}
              />
            ) : (
              <img
                src={editingImage.src}
                alt={editingImage.alt}
                className="h-40 w-full rounded-2xl object-cover"
                style={{ marginBottom: "20px" }}
              />
            )}

            <div className="flex flex-col gap-y-5">
              <div>
                <label className="block font-bold text-[13px] text-slate-600/90 mb-2">
                  DESCRIPTION
                </label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  style={{ padding: "12px 16px" }}
                  className="w-full rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block font-bold text-[13px] text-slate-600/90 mb-2">
                  CATEGORY
                </label>
                <CategoryDropdown
                  value={editCategory}
                  onChange={setEditCategory}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
              style={{ padding: "12px 32px", marginTop: "24px" }}
              className="w-full rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-indigo-800 disabled:opacity-60"
            >
              {isSavingEdit ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}