"use client";
import style from "./index.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/atoms/inputField";
import Button from "@/components/atoms/button";
import AxiosService from "@/lib/services/axios";

const SignUpForm = () => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiService = new AxiosService();

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Call the signup function from AxiosService
        const response = await apiService.signUp(data);
        console.log("Signup successful:", response);
        setSubmitted(true);
        // Here you might want to redirect the user or show a success message
      } catch (error) {
        console.error("Signup failed:", error);
        // Here you might want to show an error message to the user
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Form is invalid, please check your inputs");
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

    // Validate password
    if (!data.password || data.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    // Validate retype password
    if (!data.retypePassword || data.retypePassword.trim() === "") {
      newErrors.retypePassword = "Please retype your password";
      isValid = false;
    } else if (data.password !== data.retypePassword) {
      newErrors.retypePassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  return (
    <motion.div className={style.right}>
      <h1 className={style.heading}>Sign Up </h1>
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
        // type="password"
      />
      {errors.password && <div className={style.error}>{errors.password}</div>}
      <InputField
        onChange={dataSetter}
        placeholder={"RETYPE PASSWORD*"}
        name={"retypePassword"}
        // type="password"
      />
      {errors.retypePassword && (
        <div className={style.error}>{errors.retypePassword}</div>
      )}
      <Button
        onClick={handleSubmit}
        placeholder={"SUBMIT"}
        content={isLoading ? "SUBMITTING..." : "SUBMIT"}
        href={""}
        fontColor={"white"}
        disabled={isLoading}
      />
    </motion.div>
  );
};

export default SignUpForm;
