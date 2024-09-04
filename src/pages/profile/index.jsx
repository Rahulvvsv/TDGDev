"use client";
import style from "./index.module.css";
import FurnitureComp from "@/components/molecules/furnitureComp";
import { useEffect, useState } from "react";
import AxiosService from "@/lib/services/axios";

const Proflie = () => {
  const [item, setItem] = useState("yourUploads");
  const [uploads, setUploads] = useState([]);
  const axiosService = new AxiosService();
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const data = await axiosService.getAllUploads();
        console.log(data);
        setUploads(data);
      } catch (error) {
        console.error("Error fetching uploads:", error);
      }
    };

    fetchUploads();
  }, []);
  console.log(uploads);

  return (
    <div className={style.main}>
      <div className={style.main2}>
        <div className={style.main3}>
          <button
            onClick={() => {
              setItem("yourUploads");
            }}
            className={item == "yourUploads" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Your Uploads
          </button>

          <button
            onClick={() => {
              setItem("yourRequests");
            }}
            className={item == "yourRequests" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Your Requests
          </button>

          <button
            onClick={() => {
              setItem("yourFavourites");
            }}
            className={item == "yourFavourites" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Your Favourites
          </button>
        </div>
      </div>
    </div>
  );
};
export default Proflie;
