"use client";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/atoms/inputField";
import Button from "@/components/atoms/button";
const LoginForm = () => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(data);
      upLoadData(data);
      setSubmitted(true);
    } else {
      toast.error("Form is invalid, please check your inputs");
    }
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate full name
    if (!data.fullName || data.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!data.image || data.image.length === 0) {
      newErrors.images = "At least one image is required";
      isValid = false;
    }

    // Validate email
    if (!data.email || data.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Validate phone
    if (!data.phone || data.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(data.phone.trim())) {
      // assuming a 10-digit phone number
      newErrors.phone = "Invalid phone number";
      isValid = false;
    }

    // Validate location
    if (!data.location || data.location.trim() === "") {
      newErrors.location = "Location is required";
      isValid = false;
    }

    // Validate exact location
    if (!data.exactLocation || data.exactLocation.trim() === "") {
      newErrors.exactLocation = "Exact location is required";
      isValid = false;
    }

    // Validate type of furniture
    if (!data.tof || data.tof.trim() === "") {
      newErrors.tof = "Type of furniture is required";
      isValid = false;
    }

    // Validate description
    if (!data.desc || data.desc.trim() === "") {
      newErrors.desc = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <motion.div className={style.right}>
      <InputField
        onChange={dataSetter}
        placeholder={"FULL NAME*"}
        name={"fullName"}
      />
      {errors.fullName && <div className={style.error}>{errors.fullName}</div>}
      <InputField onChange={dataSetter} placeholder={"EMAIL*"} name={"email"} />
      {errors.email && <div className={style.error}>{errors.email}</div>}
      <InputField onChange={dataSetter} placeholder={"PHONE*"} name={"phone"} />
      {errors.phone && <div className={style.error}>{errors.phone}</div>}
      <InputField
        onChange={dataSetter}
        placeholder={"PASSWORD*"}
        name={"password"}
      />
      {errors.phone && <div className={style.error}>{errors.phone}</div>}
      <Button
        onClick={handleSubmit}
        placeholder={"SUBMIT"}
        content={"SUBMIT"}
        href={""}
        fontColor={"white"}
      />
    </motion.div>
  );
};
export default LoginForm;
