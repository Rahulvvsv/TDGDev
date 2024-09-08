import style from "./index.module.css";
function dateTimeFormateer(timestamp) {
  try {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    const date = new Date(milliseconds);
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  } catch {
    return null;
  }
}
const RecipientDetails = (data) => {
  //console.log(data)
  const name = data.data?.value?.name;
  const contact = data?.data.value?.contact;
  const date = dateTimeFormateer(data?.data?.value?.recDate);

  return (
    <div style={{ marginTop: 15, marginLeft: 20 }} className={style.main}>
      {data.data.value.itemStatus != undefined ? (
        <div className={style.main222}>
          <p className={name ? "" : style.main333}>
            Status: {data.data?.value?.itemStatus}
          </p>
          {name && <p>Name: {name}</p>}
          {contact && <p>Contact: {contact}</p>}
          {date && <p>Date: {date}</p>}
        </div>
      ) : (
        <p className={style.main2}>__</p>
      )}
    </div>
  );
};
export default RecipientDetails;
