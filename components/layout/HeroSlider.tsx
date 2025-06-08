"use client";

import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
  useEffect(() => {
    // Prevent hydration mismatch with Swiper SSR
  }, []);

  const desktopSlides = [
    {
      bg: "#fffedb",
      img: "https://www.desinelle.com/storage/media/IzWNj3NsxWWne7yts6iCxzIOHNteBnbGOKTlTDGX.jpg",
    },
    {
      bg: "#ffdbdb",
      img: "https://www.desinelle.com/storage/media/zUdS1x58j4zGSPc1rJ5sNnWXZC1yFRkriNJLadgR.jpg",
    },
    {
      bg: "#000000",
      img: "https://www.desinelle.com/storage/media/PchiD34wwfWsWjtkbH7PN8Hsh9oiz4fbqqT1MogX.jpg",
    },
  ];

  const mobileSlides = [
    {
      bg: "#c3b988",
      img: "https://www.desinelle.com/storage/media/uM0vaxj0SSVK1uUZhN1X7YsfEqoAWWix2oPbu76b.jpg",
    },
    {
      bg: "#e5cde1",
      img: "https://www.desinelle.com/storage/media/Tz2RO32RcjAJkgBYK1UF9VCGHPgrMEM8t9bxF2y4.jpg",
    },
    {
      bg: "#000000",
      img: "https://www.desinelle.com/storage/media/s1mPbTK0qjbeB18Uj6AwcptrFVZGbmKjRefRrnPU.jpg",
    },
  ];

  const textSlides = [
    "Style Boldly",
    "Look Sharp",
    "Stay Elegant",
    "Match Accessories With Your Outfit",
    "Work Wear",
  ];

  return (
    <div className="w-full">
      {/* Desktop Slider */}
      {/* Desktop */}
      <section className="hidden sm:block">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          speed={1000}
          className="w-full"
        >
          {desktopSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="flex justify-center items-center h-[70vh] min-h-[400px]"
                style={{ backgroundColor: slide.bg }}
              >
                <Image
                  src={slide.img}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Mobile */}
      <section className="block sm:hidden mt-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          speed={1000}
          className="w-full"
        >
          {mobileSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="flex justify-center items-center h-[50vh] min-h-[300px]"
                style={{ backgroundColor: slide.bg }}
              >
                <Image
                  src={slide.img}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Text Slider */}
      <section className="w-full bg-black text-white h-[80px] flex items-center justify-center">
        <Swiper
          spaceBetween={10}
          slidesPerView="auto"
          loop
          speed={800}
          autoplay={{ delay: 2000 }}
          className="text-center text-lg font-semibold"
        >
          {textSlides.map((text, i) => (
            <SwiperSlide
              key={i}
              className="inline-block px-4 text-white w-full "
            >
              {text}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
