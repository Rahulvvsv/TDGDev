"use client";
import style from "./index.module.css";
import FurnitureComp from "@/components/molecules/furnitureComp";
import { useEffect, useState } from "react";
import AxiosService from "@/lib/services/axios";

const Proflie = ({ furnitureData }) => {
  console.log(furnitureData, "from here");
  const [item, setItem] = useState("yourUploads");
  const [uploads, setUploads] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [data, setData] = useState(furnitureData?.uploads);
  const [myRequests, setMyRequests] = useState([]);
  const [href, setHref] = useState("/profile/viewUpload");
  const axiosService = new AxiosService();

  useEffect(() => {
    setUploads(furnitureData?.uploads);
    setMyRequests(furnitureData?.myRequests);
    setFavourites(furnitureData?.favourites);
    setData(furnitureData?.uploads);
  }, []);
  console.log(uploads);

  const handleItemChange = (newItem, newData, newHrefPrefix) => {
    setItem(newItem);
    setData(newData);
    setHref(newHrefPrefix);
  };

  return (
    <div className={style.main}>
      <div className={style.main2}>
        <div className={style.main3}>
          <button
            onClick={() =>
              handleItemChange("yourUploads", uploads, "/profile/viewUpload")
            }
            className={item == "yourUploads" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Your Uploads
          </button>

          <button
            onClick={() =>
              handleItemChange(
                "yourRequests",
                myRequests,
                "/donate/getFurnitureById"
              )
            }
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
          {data
            .filter((item) => item.files != undefined)
            .map((item) => (
              <FurnitureComp
                key={item.id}
                key1={item.id}
                Img={item.files}
                name={item.typeOfFurniture}
                desc={item.description}
                unqId={item.id}
                date={item.createdAt}
                location={item.location}
                showButton={true}
                content={"View Furniture"}
                showDetails={false}
                href={`${href}/${item.id}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps(context) {
  try {
    const apiService = new AxiosService();
    const cookie = context.req.headers.cookie;

    const data = await apiService.getMyProfile(cookie);

    console.log(data, "from here data");

    return {
      props: {
        furnitureData: data,
      },
    };
  } catch (error) {
    console.error("Error fetching furniture data:", error);
    return {
      props: {
        furnitureData: {},
      },
    };
  }
}
export default Proflie;
