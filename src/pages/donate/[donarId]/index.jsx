import style from "./index.module.css";
import { fetchSingleBasedOnId } from "@/lib/firebase";
import ReceipientForm from "@/components/newMolecules/ReceiptDetailsForm";
import "react-datepicker/dist/react-datepicker.css";
const index = ({ data, id,itemStatus }) => {

  data = JSON.parse(data)
  return (
    <section className={style.main}>
      <ReceipientForm
        images={data?.donarDetails.imageUrl}
        name={data?.donarDetails.name}
        productName={data?.donarDetails.productName}
        productId={id}
        itemStatus={itemStatus}
        description={data?.donarDetails.description}
      ></ReceipientForm>
    </section>
  );
};

export async function getServerSideProps(context) {
  const { params,query } = context;

  let id = params.donarId;
  let itemStatus = query.itemStatus
  let data = await fetchSingleBasedOnId(id);
  data = JSON.stringify(data)
  console.log(params,"from get recipient details")

  return {
    props: {
      data,
      id,
      itemStatus
    },
  };
}
export default index;
