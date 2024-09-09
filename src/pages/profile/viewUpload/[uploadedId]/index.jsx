import AxiosService from "@/lib/services/axios";
import ProductPage from "@/components/newMolecules/uploadedImagePage";

const ViewUploadPage = ({ furnitureData, furnitureId }) => {
  return (
    <ProductPage furnitureData={furnitureData} furnitureId={furnitureId} />
  );
};

export async function getServerSideProps(context) {
  const { uploadedId } = context.params;
  const cookie = context.req.headers.cookie;

  try {
    const apiService = new AxiosService();
    const { data, error } = await apiService.getFurnitureById(
      uploadedId,
      cookie,
      true
    );
    const finalData = data.data;
    if (error) {
      throw new Error("Failed to fetch furniture data");
    }

    return {
      props: {
        furnitureData: finalData,
        furnitureId: uploadedId,
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
export default ViewUploadPage;
