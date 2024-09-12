import AllFurnitureProducts from "@/components/molecules/allFurnitureProducts";
import style from "./index.module.css";
import { fetchData } from "@/lib/firebase";
import { locationsData } from "../[location]";
import AxiosService from "@/lib/services/axios";
import Link from "next/link";
const index = ({ data }) => {
  return (
    <section className={style.main}>
      <section className={style.left}>
        <Link href={"/"} className={style.lists + " " + style.back}>
          All
        </Link>
        {locationsData.map((e, key) => {
          return (
            <Link
              href={"/donate/getFurniture/" + e}
              key={key}
              className={style.lists}
            >
              {e}
            </Link>
          );
        })}
      </section>
      <section className={style.right}>
        <AllFurnitureProducts data={data}></AllFurnitureProducts>
      </section>
    </section>
  );
};

export async function getServerSideProps(context) {
  // Fetch data for the specified page
  // let data = await fetchData();
  let axios = new AxiosService();
  const cookie = context.req.headers.cookie;

  let allUploads = await axios.getAllUploads(cookie);

  return {
    props: {
      data: allUploads.data,
    },
  };
}
export default index;
