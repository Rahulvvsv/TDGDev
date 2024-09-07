import React from "react";
import Image from "next/image";
import { Heart, Eye } from "react-feather";
import FurnitureComp from "@/components/molecules/furnitureComp";
import AxiosService from "@/lib/services/axios";
import styles from "./index.module.css";

const ProductPage = ({ furnitureData }) => {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <ul>
          <li>Get Furniture</li>
          <li>&gt;</li>
          <li>See all Furniture</li>
          <li>&gt;</li>
          <li>New York</li>
        </ul>
      </nav>

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          {/* <Image
            src="/path-to-chair-image.jpg"
            alt="Fabric Chair"
            width={500}
            height={500}
            className={styles.productImage}
          /> */}
          <FurnitureComp
            Img={[]}
            name={furnitureData?.name}
            desc={furnitureData?.description}
            key1={furnitureData?.id}
            showButton={true}
            unqId={furnitureData?.id}
            date={furnitureData?.date}
            location={furnitureData?.location}
          />
          <button className={styles.likeButton}>
            <Heart />
          </button>
        </div>

        <div className={styles.productDetails}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Fabric Chair</h1>
            <span className={styles.availability}>Available</span>
          </div>

          <div className={styles.stats}>
            <span className={styles.stat}>
              <Heart className={styles.icon} /> 74
            </span>
            <span className={styles.stat}>
              <Eye className={styles.icon} /> 24 views
            </span>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Description</h2>
            <p>
              Jacket made of a loose fit makes the product a universal element
              of the upper layer. Two patch pockets and one hidden pocket.
              Branded lining with FABLE pattern. Shoulder pads of medium
              rigidity for shaping.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Donor Details</h2>
            <p>
              <strong>Name:</strong> Aarya Joshi (Donor)
            </p>
            <p>
              <strong>Email:</strong> aaryaa2512@gmail.com
            </p>
            <p>
              <strong>Location:</strong> New York
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { productId } = context.params;

  try {
    const apiService = new AxiosService();
    const { data, error } = await apiService.getFurnitureById(productId);
    console.log("hello ther how are you from here");
    if (error) {
      throw new Error("Failed to fetch furniture data");
    }

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching furniture data:", error);
    return {
      props: {
        furnitureData: null,
      },
    };
  }
}
export default ProductPage;
