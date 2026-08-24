export const Hero = () => (
  <section className="mb-12 lg:mb-16 xl:mb-24">
    <div className="container">
      <div className="bg-top-main pt-8 px-8 lg:pt-0 rounded-3xl lg:min-h-[500px] xl:min-h-[620px] 2xl:min-h-[760px] gap-y-14 flex flex-col lg:flex-row justify-between items-center bg-[#DBEFFA]">
        <div className="lg:w-1/2 text-center items-center lg:items-start lg:text-start flex flex-col gap-y-6 lg:gap-y-8">
          <h1 className="text-4xl leading-snug lg:text-5xl lg:leading-snug font-bold text-slate-800">
            Discover the Power of Authentic Ayurveda
          </h1>
          <p className="text-slate-800/70 font-medium text-base lg:text-lg w-[90%]">
            Experience personalized Ayurvedic care in Pipalbot, Boudha,
            Kathmandu. Our experienced practitioners provide traditional
            Ayurvedic consultations, holistic treatments, and wellness guidance
            in a caring environment focused on your health and well-being.
          </p>
          <a
            className="h-12 w-44 bg-primary text-white text-sm font-bold text-center leading-[3rem] rounded-xl transition-colors hover:bg-primary-hover"
            href="/#contact"
          >
            Book appointment
          </a>
        </div>
        <div className="lg:w-1/2 mt-auto">
          <img className="" src="/images/top-main.jpg" alt="" />
        </div>
      </div>
    </div>
  </section>
);
