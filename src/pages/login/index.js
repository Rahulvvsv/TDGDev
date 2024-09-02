import styles from "./index.module.css";
import SignUpForm from "@/components/newMolecules/signUpForm";
import LoginForm from "@/components/newMolecules/loginForm";
import Image from "next/image";

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* <SignUpForm></SignUpForm> */}
        <LoginForm></LoginForm>
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
