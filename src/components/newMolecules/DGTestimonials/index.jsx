"use client";
import { useEffect } from "react";
import { useState } from "react";
import { fetchTestimonialData } from "@/lib/firebase";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import style from "./index.module.css";
import Status from "@/components/newMolecules/DGStatusTestimonial";
import { Tooltip } from "@mui/material";

const columns = [
  {
    field: "Name",
    headerName: "Name",
    width: 200,
    headerClassName: style.header,

    renderCell: (params) => (
      <p style={{ marginTop: 50, marginLeft: 40 }}>{params.value}</p>
    ),
  },

  {
    field: "Email",
    headerName: "Contact",
    width: 200,

    renderCell: (params) => (
      <p style={{ marginLeft: 20, marginTop: 50 }}>{params.value}</p>
    ),
  },
  {
    field: "Location",
    headerName: "Location",
    width: 100,

    renderCell: (params) => (
      <p style={{ marginLeft: 20, marginTop: 50 }}>{params.value}</p>
    ),
  },
  {
    field: "Testimonial",
    headerName: "Testimonial",
    width: 250,
    height: 300,
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          marginTop: 50,
          marginLeft: 20,
          flexDirection: "column",
        }}
      >
        <Tooltip
          title={<div style={{ width: 300, height: 100,fontSize:14 }}>{params.value}</div>}
          placement="bottom-start"
        >
        <p>{params.value}</p>
        </Tooltip>
      </div>
    ),
  },
  {
    field: "Status",
    headerName: "Status",
    headerClassName: style.header,
    width: 220,
    renderCell: (params) => <Status data={params}></Status>,
  },
];

export default function DataGridTestimonialApprover() {
  const [rows, setRows] = useState({});
  const [filteredRows, setFilteredRows] = useState([]);
  useEffect(() => {
    const fetcher = async () => {
      let data = await fetchTestimonialData();
      let rowValues = data.map((e) => {
        let value = {
          id: e.id,
          Name: e.name,
          Testimonial: e.testimonial,
          Location: e.location,
          Email: e.email,
          Status: { status: e.status, id: e.id },
          DonatedItem: e.furnitureDonatedItem,
        };
        return value;
      });
      setRows(rowValues);
      setFilteredRows(rowValues);
    };
    fetcher();
  }, []);

  return (
    <div className={style.dataGrid}>
      <Box sx={{ height: 1180, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          rowHeight={100}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Box>
    </div>
  );
}
