import AOSComponent from "../AOS";
import { useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import SingleTestimonial from "../SingleTestimonial";
import style from "./index.module.css";
// Import Swiper styles
import "swiper/css";
import { fetchTestimonialData } from "@/lib/firebase";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay } from "swiper/modules";

export default function App() {
  const [slidesPerView, setSlidesPerView] = useState(2.4);
  const [isVisible, setIsVisible] = useState(false);
  const [arr, setArr] = useState([]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 460) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 980) {
        setSlidesPerView(1.4);
      } else {
        setSlidesPerView(2.9);
      }
      const fetchData = async () => {
        const data = await fetchTestimonialData();
        setArr(data);
      };
      fetchData();
      //console.log(arr)
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Swiper
        spaceBetween={10}
        centeredSlides={true}
        slidesPerView={slidesPerView}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        freeMode={true}
        modules={[Autoplay]}
        className={style.Swiper}
      >
        {arr
          .filter((e) => e.status == "showOnPage")
          .map((e) => {
            return (
              <SwiperSlide>
                <SingleTestimonial
                  index={0}
                  testimonial={e.testimonial}
                  name={e.name}
                  surname={e.location}
                ></SingleTestimonial>
              </SwiperSlide>
            );
          })}
      </Swiper>
      <br></br>
    </>
  );
}
