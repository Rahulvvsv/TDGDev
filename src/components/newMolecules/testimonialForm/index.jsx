"use client";
import style from "./index.module.css";
import InputField from "../../atoms/inputField";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Button from "../../atoms/button";
import { uploadTestimonial } from "@/lib/firebase";
import { useEffect, useState } from "react";

const TestimonialForm = ({ href }) => {
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate full name
    if (!data.fullName || data.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    // Validate email
    if (!data.email || !data.email.trim()) {
      newErrors.email = "Contact details are required";
      isValid = false;
    } 

    // Validate phone
    if (!data.location || data.location.trim() === "") {
      newErrors.location = "Location  is required";
      isValid = false;
    }

    // Validate service
    if (!data.testimonial || data.testimonial.trim() === "") {
      newErrors.service = "Testimonial is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      uploadTestimonial(data);
      setSubmitted(true);
    }
  };

  return (
    <div className={style.main2}>
      {!submitted ? (
        <>

      <section className={style.secc}>
        
      <h1 className={style.heading2 +" " + style.heading3} > Share Your Experience</h1>
      <h1 className={style.heading2}>We would love to hear about your experience with the TDG Furniture Exchange. </h1>
      <h1 className={style.heading2}>Your testimonial helps us inspire others and improve our service. Thank you for your support!</h1>
      </section>
          <InputField
            onChange={dataSetter}
            placeholder={"FULL NAME*"}
            name="fullName"
          />
          {errors.fullName && (
            <div className={style.error}>{errors.fullName}</div>
          )}

          <InputField
            onChange={dataSetter}
            placeholder={"EMAIL*"}
            name="email"
          />
          {errors.email && (
            <div className={style.error} style={{ marginTop: 10 }}>
              {errors.email}
            </div>
          )}

          <InputField
            placeholder={"LOCATION*"}
            onChange={dataSetter}
            name="location"
          />
          {errors.location && (
            <div className={style.error} style={{ marginTop: 10 }}>
              {errors.location}
            </div>
          )}
                  <InputField
            placeholder={"FURNITURE ITEM DONATED "}
            onChange={dataSetter}
            name="donatedItem"
          />
      

          <InputField
            type="text-area"
            height={100}
            onChange={dataSetter}
            placeholder={"TESTIMONIAL*"}
            name="testimonial"
          />
          {errors.service && (
            <div className={style.error}>{errors.service}</div>
          )}
          <Button type="submit" content={"SUBMIT"} onClick={handleSubmit} />
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className={style.heading4}>
              Thank you for your valuable feedback.
            </h1>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TestimonialForm;
