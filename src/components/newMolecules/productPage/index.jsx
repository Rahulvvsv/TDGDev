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

const ProductPage = ({ furnitureData }) => {
  const [question, setQuestion] = useState("");
  const [liked, setLiked] = useState(furnitureData?.liked);
  const [donorDetails, setDonorDetails] = useState(false);
  const axiosService = new AxiosService();

  const router = useRouter();
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
          {/* <li>See all Furniture</li>
          <li>&gt;</li> */}
          <li>{furnitureData?.location}</li>
        </ul>
      </nav>

      <div className={styles.content}>
        <div className={styles.imageContainer} id={styles.imageContainer1}>
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
              <span className={styles.availability}>
                {furnitureData?.itemStatus}
              </span>
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                <Heart
                  style={{
                    fill: liked ? "rgba(121, 117, 114, 1)" : "none",
                    color: "rgba(121, 117, 114, 1)",
                  }}
                  onClick={async (event) => {
                    const heart = event.currentTarget;
                    const newLikedState = !liked;
                    heart.style.fill = newLikedState
                      ? "rgba(121, 117, 114, 1)"
                      : "none";

                    try {
                      const data = {
                        uploadedImageRefId: furnitureData?.id,
                        action: newLikedState ? "like" : "unlike",
                      };
                      const response = await axiosService.userLikeAction(data);
                      // Handle the response if needed
                    } catch (error) {
                      console.error("Error performing like action:", error);
                      // Revert the heart fill if the API call fails
                      heart.style.fill = liked
                        ? "rgba(121, 117, 114, 1)"
                        : "none";
                    }
                  }}
                />{" "}
                &nbsp; {furnitureData?.likesCount}
              </span>
              <span className={styles.stat}>
                <Eye className={styles.icon} /> {furnitureData?.viewCount} views
              </span>
            </div>
          </div>

          <hr />
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Description</h2>
            <p className={styles.descriptionProduct}>
              {furnitureData?.description}
            </p>
          </section>
          {furnitureData.alreadyRequested && (
            <p className={styles.descriptionProduct2}>
              You have already requested this item, Do you want to request
              again?
            </p>
          )}
          <br />
          {!donorDetails && (
            <>
              <InputField
                type="text"
                placeholder="Ask a question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></InputField>
              <br />
              <div className={styles.buttonContainer}>
                <Button
                  backgroundColor={"white"}
                  content={"Get Donor Details"}
                  fontColor={"rgba(121, 117, 114, 1)"}
                  onClick={ask}
                  btnClass={2}
                />
              </div>
            </>
          )}
          {donorDetails && (
            <>
              <div className={styles.buttonContainer}>
                <Button
                  backgroundColor={"white"}
                  effect={false}
                  width={"500px"}
                  content={"Your request has been sent"}
                  fontColor={"rgba(121, 117, 114, 1)"}
                  onClick={() => {
                    // console.log("clicked");
                  }}
                  href={""}
                  btnClass={2}
                />
              </div>
            </>
          )}

          <hr />
          {(donorDetails || furnitureData.alreadyRequested) && (
            <section className={styles.section2}>
              <h2 className={styles.sectionTitle}>Donor Details</h2>
              <p className={styles.descriptionProduct}>
                Name: {furnitureData.fullName}
              </p>
              <p className={styles.descriptionProduct}>
                Email: {furnitureData.email}
              </p>
              <p className={styles.descriptionProduct}>
                Location: {furnitureData.location}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
