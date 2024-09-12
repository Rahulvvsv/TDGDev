"use client";
import styles from "./index.module.css";
import SignUpForm from "@/components/newMolecules/signUpForm";
import LoginForm from "@/components/newMolecules/loginForm";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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
      setIsSignUp(signUp === undefined ? false : signUp !== "true");
      setIsSignUpSuccess(signUp === undefined ? false : signUp === "true");
    }
  }, [router.isReady, router.query]);
  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleLoginClick = () => {
    setIsSignUp(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {isSignUp ? (
          <SignUpForm onLoginClick={handleLoginClick} />
        ) : (
          <LoginForm
            onSignUpClick={handleSignUpClick}
            isSignUp={isSignUpSuccess}
          />
        )}
      </div>
      <div className={styles.rightMain}>
        <div className={styles.right}>
          <Image
            src={"/login/login.png"}
            fill
            objectFit="cover"
            objectPosition="top"
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default Login;
