"use client";
import MobileHeader from "../mobileHeader";
import style from "./index.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import AxiosService from "@/lib/services/axios";
import { parseCookies } from "nookies";
const Header = () => {
  const [selected, setSelected] = useState(0);
  const [toggleNavbar, setToggleNavbar] = useState(false);
  const [authCookie, setAuthCookes] = useState(false);
  const cookies = parseCookies();
  const router = useRouter();
  const search = router.asPath;
  const axiosService = new AxiosService();
  useEffect(() => {
    if (search.includes("donate")) {
      setSelected(1);
      if (search.includes("getFurniture")) {
        setSelected(6);
      }
    } else if (search.includes("aboutUs")) {
      setSelected(2);
    } else if (search.includes("contactUs")) {
      setSelected(3);
    } else if (search.includes("adminPage")) {
      setSelected(10);
    } else if (search.includes("login")) {
      setSelected(11);
    } else if (search.includes("profile")) {
      setSelected(12);
    } else {
      setSelected(0);
    }

    setAuthCookes(cookies["loggedIn"]);
    //console.log(authCookie, cookies, "from here");
  }, [search, cookies]);
  return (
    <div style={{ position: "relative" }}>
      <AnimatePresence>
        <div
          className={style.main}
          style={selected == 11 ? { marginBottom: 0 } : {}}
        >
          <div
            className={style.main2}
            onClick={() => {
              router.push("/");
            }}
          >
            <Image alt=" " src={"/Icon/logo2.png"} fill></Image>
          </div>

          {/* {selected == 0 && (
            <div
              className={style.main999}
              onClick={() => {
                router.push("/requestsHandler/adminPage");
              }}
            >
              <Image src={"/Icon/person.png"} width={16} height={16}></Image>
              <p>Admin Login</p>
            </div>
          )} */}

          {/* {(selected == 0 || selected == 12) && ( */}
          <div
            className={style.main999}
            onClick={async () => {
              const route = !authCookie ? "/login" : "/profile";
              if (selected == 12) {
                await axiosService.logout();
                router.push("/");
              } else {
                router.push(route);
              }
            }}
          >
            <Image src={"/Icon/person.png"} width={16} height={16}></Image>
            {!authCookie && <p> Login</p>}
            {selected == 12 && <p>Logout</p>}
          </div>
          {/* )} */}
          <div className={style.main3}>
            <Link href={"/"} style={{ position: "relative" }}>
              <h1
                className={style.heading}
                onClick={() => {
                  setSelected(0);
                }}
              >
                {" "}
                Home
              </h1>
              {selected === 0 ? (
                <motion.div
                  transition={{ type: "spring" }}
                  layoutId="underline"
                  style={{
                    width: "100%",
                    position: "absolute",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "#797572",
                  }}
                ></motion.div>
              ) : (
                ""
              )}
            </Link>
            <Link
              href={"/donate/getFurniture"}
              style={{ position: "relative" }}
            >
              <h1
                className={style.heading}
                onClick={() => {
                  setSelected(6);
                }}
              >
                {" "}
                Furniture
              </h1>
              {selected === 6 ? (
                <motion.div
                  transition={{ type: "spring" }}
                  layoutId="underline"
                  style={{
                    width: "100%",
                    position: "absolute",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "#797572",
                  }}
                ></motion.div>
              ) : (
                ""
              )}
            </Link>

            <Link href={"/donate"} style={{ position: "relative" }}>
              <h1
                className={style.heading}
                onClick={() => {
                  setSelected(1);
                }}
              >
                {" "}
                Donate
              </h1>

              {selected === 1 ? (
                <motion.div
                  transition={{ type: "spring" }}
                  layoutId="underline"
                  style={{
                    width: "100%",
                    position: "absolute",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "#797572",
                  }}
                ></motion.div>
              ) : (
                ""
              )}
            </Link>

            <Link href="/aboutUs" style={{ position: "relative" }}>
              <h1
                className={style.heading}
                onClick={() => {
                  setSelected(2);
                }}
              >
                {" "}
                About Us
              </h1>
              {selected === 2 ? (
                <motion.div
                  transition={{ type: "spring" }}
                  layoutId="underline"
                  style={{
                    width: "100%",
                    position: "absolute",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "#797572",
                  }}
                ></motion.div>
              ) : (
                ""
              )}
            </Link>
            <Link href="/contactUs" style={{ position: "relative" }}>
              <h1
                className={style.heading}
                onClick={() => {
                  setSelected(3);
                }}
              >
                {" "}
                Contact
              </h1>
              {selected === 3 ? (
                <motion.div
                  transition={{ type: "spring" }}
                  layoutId="underline"
                  style={{
                    width: "100%",
                    position: "absolute",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "#797572",
                  }}
                ></motion.div>
              ) : (
                ""
              )}
            </Link>
          </div>
          <div className={style.main4}>
            <Image
              src={"/Icon/hamb.png"}
              onClick={() => {
                setToggleNavbar(true);
              }}
              width={29}
              height={22}
            ></Image>
          </div>
        </div>
      </AnimatePresence>
      <AnimatePresence>
        {toggleNavbar && (
          <motion.section
            layout
            initial={{ x: 250, opacity: 0, y: -30 }}
            animate={{ x: 0, opacity: 1, y: -30 }}
            exit={{ x: 550, opacity: 0 }}
            style={{
              position: "absolute",
              zIndex: 5999999999999999,
              top: 0,
              left: 0,
              width: "100vw !important",
              height: "100vh !important",
            }}
          >
            <MobileHeader
              toggler={setToggleNavbar}
              selected={selected}
            ></MobileHeader>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
