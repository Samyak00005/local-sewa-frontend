import HeroContent from "./HeroContent";
import LocationLogic from "./LocationLogic";

function HeroSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#087A3F]
        via-[#0A8F4B]
        to-[#12A85A]
        text-white
      "
    >
      {/* ----- DECORATIVE BACKGROUND ----- */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Right Circle */}

        <div
          className="
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            bg-white/10
            blur-2xl
          "
        />

        {/* Bottom Left Circle */}

        <div
          className="
            absolute
            -bottom-32
            -left-28
            h-80
            w-80
            rounded-full
            bg-[#6EE7A0]/15
            blur-3xl
          "
        />

        {/* Middle Glow */}

        <div
          className="
            absolute
            right-[20%]
            top-[35%]
            h-48
            w-48
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        {/* Pattern */}

        <div
          className="
            absolute
            inset-0
            opacity-30
            [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)]
            [background-size:22px_22px]
          "
        />
      </div>

      {/* ----- HERO CONTAINER ----- */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          pb-10
          pt-5
          sm:px-6
          sm:pb-14
          sm:pt-8
          lg:px-8
          lg:pb-20
          lg:pt-12
        "
      >
        {/* ----- LOCATION + HERO CONTENT ----- */}

        <LocationLogic>
          <HeroContent />
        </LocationLogic>
      </div>
    </section>
  );
}

export default HeroSection;
