import style from "./index.module.css";
import AllFurnitureProducts from "@/components/molecules/allFurnitureProducts";
import AxiosService from "@/lib/services/axios";
import BackButton from "@/components/molecules/backButton";
export const locationsData = [
  "Baltimore",
  "Cleveland",
  "Jerusalem",
  "Lakewood",
  "Los Angeles",
  "Miami",
  "New Jersey",
  "New York",
  "Toronto",
];
import { Suspense } from "react";
const index = ({ data, id }) => {
  return (
    <section className={style.main}>
      <section className={style.internal}>
        <BackButton></BackButton>
      </section>
      <h1 className={style.heading}>{id}</h1>
      <Suspense fallback={<h1>Loading</h1>}>
        <AllFurnitureProducts data={data}></AllFurnitureProducts>
      </Suspense>
    </section>
  );
};

// export async function getStaticPaths(context) {
//     let mappedData = [];
//     for (let location of locationsData) {
//       mappedData.push({
//         params: { location: location },
//       });
//     }
//     return {
//       paths: mappedData,
//       fallback: false,
//     };
//   }

export async function getServerSideProps(context) {
  const { params } = context;
  let id = params.location;
  let axios = new AxiosService();
  let cookie = context.req.headers.cookie;
  let data = await axios.getAllUploads(cookie, id);

  return {
    props: {
      data: data.data,
      id,
    },
  };
}
export default index;
