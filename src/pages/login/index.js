"use client";
import styles from "./index.module.css";
import SignUpForm from "@/components/newMolecules/signUpForm";
import LoginForm from "@/components/newMolecules/loginForm";
import Image from "next/image";
import { useState } from "react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

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
          <LoginForm onSignUpClick={handleSignUpClick} />
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
