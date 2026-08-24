// import { Branches } from "@/components/Branches";
import { Contact } from "@/components/Contact";
import { Doctors } from "@/components/Doctors";
import { Emergency } from "@/components/Emergency";
import { Expert } from "@/components/Expert";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
// import { Testimonial } from "@/components/Testimonial";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Emergency />
      <Features />
      <Expert />
      <Doctors />
      {/* <Testimonial /> */}
      {/* <Branches /> */}
      <Contact />
    </>
  );
}
