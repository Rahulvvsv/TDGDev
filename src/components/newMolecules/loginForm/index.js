"use client";
import style from "./index.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/atoms/inputField";
import Button from "@/components/atoms/button";
import { useRouter } from "next/router";
import AxiosService from "@/lib/services/axios";

const LoginForm = ({ onSignUpClick, isSignUp, onForgotPasswordClick }) => {
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
        // // Call the signup function from AxiosService
        // const response = await apiService.login(data);
        // //console.log("Signup successful:", response);
        // setSubmitted(true);
        // // Here you might want to redirect the user or show a success message
        const { message, error } = await apiService.login(data);
        console.log(message, "message");
        if (!error) {
          if (message == "success") {
            router.push("/");
            //console.log("loggedIn");
          }
          setSubmitted(true);
        } else {
          setErrors({ backend: message });
          //console.log(errors, "hello there");
        }
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
      {isSignUp ? (
        <p>Your account is created successfully, please login</p>
      ) : (
        ""
      )}
      <h1 className={style.heading}>Login</h1>
      <InputField onChange={dataSetter} placeholder={"EMAIL*"} name={"email"} />
      {errors.email && <div className={style.error}>{errors.email}</div>}
      <InputField
        onChange={dataSetter}
        placeholder={"PASSWORD*"}
        name={"password"}
        type={"password"}
      />
      {errors.password && <div className={style.error}>{errors.password}</div>}
      <p className={style.forgot} onClick={onForgotPasswordClick}>
        Forgot password?
      </p>
      <Button
        onClick={handleSubmit}
        placeholder={"SUBMIT"}
        effect={false}
        content={isLoading ? "SUBMITTING..." : "SUBMIT"}
        href={""}
        fontColor={"white"}
      />
      <p className={style.forgot1}>
        Don't have an account?{" "}
        <span className={style.signUp} onClick={onSignUpClick}>
          Sign Up
        </span>
      </p>
      {errors.backend && <div className={style.error}>{errors.backend}</div>}
    </motion.div>
  );
};
export default LoginForm;
