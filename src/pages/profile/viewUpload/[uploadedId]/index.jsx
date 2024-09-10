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

  // Parse the cookie
  const parsedCookie = {};
  if (cookie) {
    cookie.split(";").forEach((pair) => {
      const [key, value] = pair.trim().split("=");
      parsedCookie[key] = value;
    });
  }

  const isLoggedIn = parsedCookie.loggedIn === "true";
  if (!isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

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
