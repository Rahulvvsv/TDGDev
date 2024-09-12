"use client";
import style from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import AxiosService from "@/lib/services/axios";
import { useState, useEffect } from "react";
const MobileHeader = ({ toggler, selected }) => {
  const [authCookie, setAuthCookie] = useState(false);

  const axiosService = new AxiosService();
  const router = useRouter();
  useEffect(() => {
    // Check for authentication cookie
    // This is a placeholder, replace with your actual auth check
    setAuthCookie(document.cookie.includes("loggedIn"));
  }, []);

  return (
    <div className={style.main}>
      <Image
        src={"/Icon/cross.png"}
        onClick={() => {
          toggler(false);
        }}
        width={32}
        height={32}
        className={style.image}
      ></Image>
      <div className={style.main2}>
        <h1
          className={style.name}
          onClick={async () => {
            const route = !authCookie ? "/login" : "/profile";
            if (selected === 12) {
              await axiosService.logout();
              router.push("/");
            } else {
              router.push(route);
            }
            toggler(false);
          }}
        >
          {!authCookie ? "Login" : selected === 12 ? "Logout" : "Profile"}
        </h1>

        <h1
          href={"/"}
          className={style.name}
          onClick={() => {
            toggler(false);
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }}
        >
          Home
        </h1>
        <h1
          onClick={() => {
            toggler(false);
            setTimeout(() => {
              router.push("/donate");
            }, 1000);
          }}
          className={style.name}
        >
          Donate
        </h1>
        <div className={style.subnames}>
          <h1
            href={"/donate"}
            onClick={() => {
              toggler(false);
              setTimeout(() => {
                router.push("/donate");
              }, 1000);
            }}
            className={style.name2}
          >
            Donate
          </h1>
          <h1
            href={"/donate/getFurniture"}
            onClick={() => {
              toggler(false);
              setTimeout(() => {
                router.push("/donate/getFurniture");
              }, 1000);
            }}
            className={style.name2}
          >
            Get Furniture
          </h1>
        </div>
        <h1
          href={"/aboutUs"}
          onClick={() => {
            toggler(false);
            setTimeout(() => {
              router.push("/aboutUs");
            }, 1000);
          }}
          className={style.name}
        >
          About Us
        </h1>
        <h1
          href={"/contactUs"}
          onClick={() => {
            toggler(false);
            setTimeout(() => {
              router.push("/contactUs");
            }, 1000);
          }}
          className={style.name}
        >
          Contact
        </h1>
      </div>
    </div>
  );
};

export default MobileHeader;
