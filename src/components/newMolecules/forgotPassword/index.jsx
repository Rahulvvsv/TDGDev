"use client";
import style from "./index.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/atoms/inputField";
import Button from "@/components/atoms/button";
import { useRouter } from "next/router";
import AxiosService from "@/lib/services/axios";

const ForgotPasswordForm = ({ onLoginClick }) => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiService = new AxiosService();
  const router = useRouter();

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const { message, error } = await apiService.forgotPassword(data);
        if (!error) {
          setSubmitted(true);
          // You might want to show a success message or redirect the user
        } else {
          setErrors({ backend: message });
        }
      } catch (error) {
        console.error("Forgot password request failed:", error);
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

    setErrors(newErrors);
    return isValid;
  };

  return (
    <motion.div className={style.right}>
      <h1 className={style.heading}>Forgot Password</h1>
      <InputField onChange={dataSetter} placeholder={"EMAIL*"} name={"email"} />
      {errors.email && <div className={style.error}>{errors.email}</div>}
      <Button
        onClick={handleSubmit}
        placeholder={"SUBMIT"}
        effect={false}
        content={isLoading ? "SUBMITTING..." : "SUBMIT"}
        href={""}
        fontColor={"white"}
      />
      <p className={style.forgot1}>
        Remember your password?{" "}
        <span className={style.signUp} onClick={onLoginClick}>
          Login
        </span>
      </p>
      {errors.backend && <div className={style.error}>{errors.backend}</div>}
      {submitted && (
        <div className={style.success}>
          Password reset email sent. Please check your inbox.
        </div>
      )}
    </motion.div>
  );
};

export default ForgotPasswordForm;
