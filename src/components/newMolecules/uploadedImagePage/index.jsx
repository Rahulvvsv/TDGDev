"use client";
import React from "react";
import { Heart, Eye } from "react-feather";
import styles from "./index.module.css";
import FurnitureComp from "@/components/molecules/furnitureComp";
import AxiosService from "@/lib/services/axios";
import Button from "@/components/atoms/button";
import { useRouter } from "next/router";
import InputField from "@/components/atoms/inputField";
import { useState } from "react";
import style from "./index.module.css";

const ProductPage = ({ furnitureData, furnitureId }) => {
  console.log(furnitureData, "furnitureData");
  const [item, setItem] = useState(furnitureData.itemStatus);
  const [question, setQuestion] = useState("");
  const [donorDetails, setDonorDetails] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [enquiryDetails, setEnquiryDetails] = useState(
    furnitureData.allRequests
  );
  const router = useRouter();
  const axiosService = new AxiosService();
  const handleItemChange = async (newItem, status, newHrefPrefix) => {
    setItem(newItem);
    await axiosService.updateItemStatus(furnitureId, status);
    // setHref(newHrefPrefix);
  };
  const ask = async () => {
    const isLoggedIn = document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("loggedIn=true"));

    if (isLoggedIn) {
      const apiService = new AxiosService();
      try {
        const response = await apiService.userRequest({
          uploadedImageRefId: furnitureData?.id,
          question: question,
        });
        console.log("User request response:", response);
        setDonorDetails(!response.error);
      } catch (error) {
        //console.log(error.message);
      }
    } else {
      router.push("/login");
    }
  };
  //console.log(furnitureData, "furnitre");
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <ul>
          <li>Get Furniture</li>
          <li>&gt;</li>
          <li>See all Furniture</li>
          <li>&gt;</li>
          <li>{furnitureData?.location}</li>
        </ul>
      </nav>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <FurnitureComp
            Img={furnitureData?.files}
            name={furnitureData?.name}
            desc={furnitureData?.description}
            key1={furnitureData?.id}
            unqId={furnitureData?.id}
            date={furnitureData?.date}
            location={furnitureData?.location}
            showButton={false}
            showDetails={false}
          />
          {/* <button className={styles.likeButton}>
            <Heart />
          </button> */}
        </div>

        <div className={styles.productDetails}>
          <div className={styles.titleAbove}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{furnitureData?.typeOfFurniture}</h1>
              <span className={styles.availability}> | </span>
              <span className={styles.availability}>{item}</span>
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                <Heart className={styles.icon} /> 74
              </span>
              <span className={styles.stat}>
                <Eye className={styles.icon} /> 24 views
              </span>
            </div>
          </div>

          <hr />
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Description</h2>
            <p className={styles.descriptionProduct}>
              {furnitureData?.descriptio}
            </p>
          </section>
          {furnitureData.alreadyRequested && (
            <p className={styles.descriptionProduct2}>
              You have already requested this item, Do you want to request
              again?
            </p>
          )}
          <br />
          <hr />
          <>
            <div className={styles.buttonContainer}>
              <button
                onClick={() =>
                  handleItemChange(
                    "Taken",
                    "Taken",
                    // uploads,
                    "/profile/viewUpload"
                  )
                }
                className={item == "Taken" ? style.btn1 : style.btn2}
              >
                Mark as Taken
              </button>

              <button
                onClick={() =>
                  handleItemChange(
                    "Available",
                    "Available",
                    "/profile/viewRequest"
                  )
                }
                className={item === "Available" ? style.btn1 : style.btn2}
              >
                Mark as Available
              </button>
            </div>
            <p>Note: You can only select one option</p>
          </>
          <br />
          <hr />
          <p className={styles.enquiryText}>Enquired By</p>

          <div className={styles.enquiryCircles}>
            {enquiryDetails &&
              enquiryDetails.map((detail, index) => (
                <div
                  className={`${styles.circle} ${styles.circleKP}`}
                  onClick={() => {
                    setShowDetails(index);
                    setDetailData(detail);
                  }}
                >
                  <span className={styles.circleText}>
                    {detail.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </span>
                </div>
              ))}
          </div>

          {detailData && (
            <div className={styles.enquiryDetails}>
              <p>Name: {detailData.name}</p>
              <p>Email: {detailData.email}</p>
              <p>Phone: {detailData.phone}</p>
              <p>Location: {detailData.location}</p>
              <p>Questions:</p>
              <p>
                {detailData.questions.map((q, qIndex) => (
                  <li key={qIndex}>{q}</li>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
