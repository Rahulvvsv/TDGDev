"use client";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/atoms/inputField";
import Button from "@/components/atoms/button";
import AxiosService from "@/lib/services/axios";

const LoginForm = () => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const apiService = new AxiosService();

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Call the signup function from AxiosService
        const response = await apiService.login(data);
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

    // Validate email
    if (!data.email || data.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Validate password
    if (!data.password || data.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <motion.div className={style.right}>
      <h1 className={style.heading}>Login</h1>
      <InputField onChange={dataSetter} placeholder={"EMAIL*"} name={"email"} />
      {errors.email && <div className={style.error}>{errors.email}</div>}
      <InputField
        onChange={dataSetter}
        placeholder={"PASSWORD*"}
        name={"password"}
      />
      {errors.password && <div className={style.error}>{errors.password}</div>}
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
