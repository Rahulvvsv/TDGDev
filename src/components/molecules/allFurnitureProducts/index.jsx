import { useState } from "react";
import { Pagination } from "@mui/material";
import style from "./index.module.css";
import FurnitureComp from "../furnitureComp";
import AxiosService from "../../../lib/services/axios";

const ITEMS_PER_PAGE = 8;

const AllFurnitureProducts = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const filteredData = data.filter((e) => e.status === "showOnPage");
  let axiosService = new AxiosService();

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Calculate the start and end indices of the items for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <div className={style.mains}>
        {currentData.map((e, key) => {
          return (
            <FurnitureComp
              unqId={e.id}
              key={key}
              axiosService={axiosService}
              Img={e?.files}
              name={e.typeOfFurniture}
              desc={e.description}
              location={e.location}
              date={e.date}
              liked={e.liked}
              showLikeButton={true}
            />
          );
        })}
        {currentData.length === 0 && (
          <h1 style={{ height: "50vh" }} className={style.heading}>
            Furniture at this location will be available soon
          </h1>
        )}

        {/* Pagination controls */}
      </div>

      <div className={style.pagination}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
        />
      </div>
    </>
  );
};

export default AllFurnitureProducts;
