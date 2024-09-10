"use client";
import style from "./index.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/atoms/inputField";
import Button from "@/components/atoms/button";
import AxiosService from "@/lib/services/axios";
import { useRouter } from "next/router";

const SignUpForm = ({ onLoginClick }) => {
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
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
        const { message, error } = await apiService.signUp(data);
        if (!error) {
          if (message == "success") {
            router.push("/login?signUp=true");
            //console.log("loggedIn");
          }
          setSubmitted(true);
        } else {
          setErrors({ backend: message });
          //console.log(errors, "hello there");
        }
      } catch (error) {
        console.error("Signup failed:", error);
        //console.log(errors, "hello there");
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
    if (!data.name || data.name.trim() === "") {
      newErrors.name = "Full name is required";
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
        name={"name"}
      />
      {errors.name && <div className={style.error}>{errors.name}</div>}
      <InputField onChange={dataSetter} placeholder={"EMAIL*"} name={"email"} />
      {errors.email && <div className={style.error}>{errors.email}</div>}
      <InputField onChange={dataSetter} placeholder={"PHONE*"} name={"phone"} />
      {errors.phone && <div className={style.error}>{errors.phone}</div>}
      <InputField
        onChange={dataSetter}
        placeholder={"PASSWORD*"}
        name={"password"}
        type="password"
      />
      {errors.password && <div className={style.error}>{errors.password}</div>}
      <InputField
        onChange={dataSetter}
        placeholder={"RETYPE PASSWORD*"}
        name={"retypePassword"}
        type="password"
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
      <p className={style.forgot1}>
        Already have an account?{" "}
        <span className={style.signUp} onClick={onLoginClick}>
          Login
        </span>
      </p>
      {errors.backend && <div className={style.error}>{errors.backend}</div>}
    </motion.div>
  );
};

export default SignUpForm;
