import AxiosService from "@/lib/services/axios";
import ProductPage from "@/components/newMolecules/productPage";

const FurnitureByIdPage = ({ furnitureData }) => {
  return <ProductPage furnitureData={furnitureData} />;
};

export async function getServerSideProps(context) {
  const { productId } = context.params;
  const cookie = context.req.headers.cookie;

  try {
    const apiService = new AxiosService();
    const { data, error } = await apiService.getFurnitureById(
      productId,
      cookie
    );
    const finalData = data.data;
    if (error) {
      throw new Error("Failed to fetch furniture data");
    }

    return {
      props: {
        furnitureData: finalData,
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
export default FurnitureByIdPage;
