"use client";
import styles from "./index.module.css";
import SignUpForm from "@/components/newMolecules/signUpForm";
import LoginForm from "@/components/newMolecules/loginForm";
import ForgotPasswordForm from "@/components/newMolecules/forgotPassword";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [authState, setAuthState] = useState("login");
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoggedIn = () => {
      const cookies = document.cookie.split(";");
      const loggedInCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("loggedIn=")
      );
      if (loggedInCookie && loggedInCookie.split("=")[1] === "true") {
        router.push("/profile");
      }
    };

    if (typeof window !== "undefined") {
      checkLoggedIn();
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady) {
      const { signUp } = router.query;
      setAuthState(
        signUp === undefined ? "login" : signUp !== "true" ? "signUp" : "login"
      );
      setIsSignUpSuccess(signUp === undefined ? false : signUp === "true");
    }
  }, [router.isReady, router.query]);

  const handleSignUpClick = () => {
    setAuthState("signUp");
  };

  const handleLoginClick = () => {
    setAuthState("login");
  };

  const handleForgotPasswordClick = () => {
    setAuthState("forgotPassword");
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {authState === "signUp" && (
          <SignUpForm onLoginClick={handleLoginClick} />
        )}
        {authState === "login" && (
          <LoginForm
            onSignUpClick={handleSignUpClick}
            onForgotPasswordClick={handleForgotPasswordClick}
            isSignUp={isSignUpSuccess}
          />
        )}
        {authState === "forgotPassword" && (
          <ForgotPasswordForm onLoginClick={handleLoginClick} />
        )}
      </div>
      <div className={styles.rightMain}>
        <div className={styles.right}>
          <Image
            src={"/login/login.png"}
            fill
            objectFit="cover"
            objectPosition="top"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
