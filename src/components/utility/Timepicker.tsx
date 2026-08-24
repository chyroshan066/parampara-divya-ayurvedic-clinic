"use client";

import { useRef, useState } from "react";
import { Clock } from "@phosphor-icons/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { formatTimeValue } from "@/utils/time-utils";

export interface TimeValue {
  hour: number; // 1-12
  minute: number; // 0, 15, 30, 45
  period: "AM" | "PM";
}

interface TimePickerProps {
  id?: string;
  label?: string;
  value: TimeValue | null;
  onChange: (time: TimeValue) => void;
  placeholder?: string;
  required?: boolean;
  /** Displayed as a hint under the picker, e.g. "Open 09:00 AM - 07:00 PM". Purely informational — doesn't restrict selection. */
  openTime?: TimeValue;
  closeTime?: TimeValue;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const MINUTES = [0, 15, 30, 45];
const PERIODS: TimeValue["period"][] = ["AM", "PM"];

const pad = (value: number) => value.toString().padStart(2, "0");

// --- Kept only as the display hint at the bottom of the picker, not as a selection limit.
const DEFAULT_OPEN_TIME: TimeValue = { hour: 9, minute: 0, period: "AM" };
const DEFAULT_CLOSE_TIME: TimeValue = { hour: 7, minute: 0, period: "PM" };

/** Shared column of selectable options, used for hour / minute / period. */
const TimeColumn = <T extends number | string>({
  options,
  selected,
  onSelect,
  format,
}: {
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
  format?: (option: T) => string;
}) => (
  <div className="flex max-h-52 flex-1 flex-col gap-y-1 overflow-y-auto px-1">
    {options.map((option) => {
      const isSelected = option === selected;
      return (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-xl px-3 py-2 text-center text-sm font-medium transition-colors ${
            isSelected
              ? "bg-primary text-white"
              : "text-slate-800 hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {format ? format(option) : option}
        </button>
      );
    })}
  </div>
);

export const TimePicker = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Select a time...",
  required,
  openTime = DEFAULT_OPEN_TIME,
  closeTime = DEFAULT_CLOSE_TIME,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  // Draft state lets the user adjust hour/minute/period before it's applied.
  const [draft, setDraft] = useState<TimeValue>(value ?? openTime);

  const updateDraft = (patch: Partial<TimeValue>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const handleDone = () => {
    onChange(draft);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* <button> doesn't support the HTML "required" attribute — validation
          is enforced by the hidden input below instead. */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="form-input flex w-full items-center text-left text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {value ? formatTimeValue(value) : placeholder}
        </span>
      </button>
      <Clock className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 text-slate-400" />
      {/* Added: invisible native input so `required` actually blocks form submission
          when no time has been picked, while staying visually hidden. */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value ? formatTimeValue(value) : ""}
          onChange={() => {}}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      )}

      {isOpen && (
        <div
          className="absolute z-20 mt-2 w-[260px] rounded-3xl border border-gray-100 bg-white p-4 shadow-2xl shadow-slate-400/20"
          role="dialog"
          aria-label={label ?? "Choose a time"}
        >
          <div className="flex divide-x divide-gray-100">
            <TimeColumn
              options={HOURS}
              selected={draft.hour}
              onSelect={(hour) => updateDraft({ hour })}
              format={pad}
            />
            <TimeColumn
              options={MINUTES}
              selected={draft.minute}
              onSelect={(minute) => updateDraft({ minute })}
              format={pad}
            />
            <TimeColumn
              options={PERIODS}
              selected={draft.period}
              onSelect={(period) => updateDraft({ period })}
            />
          </div>

          {/* Informational only — shows the clinic's hours, doesn't restrict what's pickable above */}
          <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
            Open {formatTimeValue(openTime)} - {formatTimeValue(closeTime)}
          </p>

          <button
            type="button"
            onClick={handleDone}
            className="mt-3 h-10 w-full rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-hover"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};