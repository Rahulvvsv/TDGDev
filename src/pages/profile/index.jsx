"use client";
import style from "./index.module.css";
import FurnitureComp from "@/components/molecules/furnitureComp";
import { useEffect, useState } from "react";
import AxiosService from "@/lib/services/axios";

const Proflie = () => {
  const [item, setItem] = useState("yourUploads");
  const [uploads, setUploads] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [data, setData] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const axiosService = new AxiosService();
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const data = await axiosService.getMyProfile();
        console.log(data);
        setUploads(data?.uploads);
        setMyRequests(data?.myRequests);
        setFavourites(data?.favourites);
        setData(data?.uploads);
      } catch (error) {
        console.error("Error fetching uploads:", error);
      }
    };

    fetchUploads();
  }, []);

  return (
    <div className={style.main}>
      <div className={style.main2}>
        <div className={style.main3}>
          <button
            onClick={() => {
              setItem("yourUploads");
              setData(uploads);
            }}
            className={item == "yourUploads" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Your Uploads
          </button>

          <button
            onClick={() => {
              setItem("yourRequests");
              setData(myRequests);
            }}
            className={item === "yourRequests" ? style.btn1 : style.btn2}
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
        <div className={style.furnitureList}>
          {data.map((item) => (
            <FurnitureComp
              key={item.id}
              key1={item.id}
              Img={item.files}
              name={item.typeOfFurniture}
              desc={item.description}
              unqId={item.id}
              date={item.createdAt}
              location={item.location}
              showButton={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Proflie;
