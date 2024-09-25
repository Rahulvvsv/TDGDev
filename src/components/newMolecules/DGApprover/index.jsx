"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { fetchData } from "@/lib/firebase";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import DGImage from "@/components/newMolecules/DGImage";
import style from "./index.module.css";
import Desc from "@/components/newMolecules/DGDescription";
import Status from "@/components/newMolecules/DGStatus";
import Reviewer from "@/components/newMolecules/DGReviewer";
import RecipientDetails from "../DGRecipient";
import AxiosService from "@/lib/services/axios";
function dateTimeFormateer(timestamp) {
  try {
    const { seconds, nanoseconds } = timestamp;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    const date = new Date(milliseconds);
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  } catch {
    const date = new Date();
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }
}

const columns = [
  {
    field: "Image",
    headerName: "Image",
    width: 150,
    height: 300,

    headerClassName: style.header,
    renderCell: (params) => <DGImage data={params.value}></DGImage>,
  },

  {
    field: "ProductName",
    headerName: "Donated Item",
    width: 200,
    renderCell: (params) => <Desc data={params.value}></Desc>,
  },

  {
    field: "Description",
    headerName: "Description",
    width: 250,
    renderCell: (params) => (
      <p style={{ marginTop: 50, marginLeft: 30 }}>{params.value}</p>
    ),
    // valueGetter: (params) => params.value
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
    field: "DonorInfo",
    headerName: "Donor Info",
    width: 250,
    renderCell: (params) => (
      <div style={{ display: "flex", marginTop: 30, flexDirection: "column" }}>
        <p
          style={{
            marginLeft: 20,
            marginTop: 50,
            marginBlockEnd: 0,
            marginBlockStart: 0,
          }}
        >
          {params.value?.name}
        </p>
        <p
          style={{
            marginLeft: 20,
            marginTop: 50,
            marginBlockEnd: 0,
            marginBlockStart: 20,
          }}
        >
          {params.value?.mail}
        </p>
      </div>
    ),
  },
  {
    field: "Phone",
    headerName: "Phone No",
    width: 150,

    renderCell: (params) => (
      <div>
        <p
          style={{
            marginLeft: 20,
            marginTop: 50,
            marginBlockEnd: 0,
            marginBlockStart: 50,
          }}
        >
          {params.value}
        </p>
      </div>
    ),
  },
  {
    field: "Status",
    headerName: "Status",
    width: 220,
    renderCell: (params) => <Status data={params}></Status>,
  },
  {
    field: "Reviewer",
    headerName: "Reviewer",
    width: 250,
    renderCell: (params) => <Reviewer data={params}></Reviewer>,
  },
  {
    field: "Recipient",
    headerName: "Availability Details",
    width: 350,
    renderCell: (params) => <RecipientDetails data={params}></RecipientDetails>,
  },
];

// export default function DataGridApprover() {
//   const [rows, setRows] = useState({});
//   const [filteredRows, setFilteredRows] = useState([]);
//   const axiosService = new AxiosService();
//   useEffect(() => {
//     const fetcher = async () => {
//       let data = await axiosService.getAllUploads();
//       console.log(data.data);
//       let rowValues = data.data.map((e) => {
//         let value = {
//           id: e.id,
//           Image: e.files,
//           ProductName: {
//             name: e.typeOfFurniture,
//             desc: e.description,
//             date: e.date,
//           },
//           Description: e.description,
//           Location: e.location,
//           DonorInfo: {
//             name: e.fullName,
//             mail: e.email,
//           },
//           Phone: e.phone,
//           Status: { status: e.status, id: e.id },
//           Reviewer: e.location,
//           Recipient: {
//             name: e.recName,
//             contact: e.recContact,
//             recDate: e.recipientReceivedDate,
//             itemStatus: e.itemStatus,
//           },
//         };
//         return value;
//       });
//       setRows(rowValues);
//       setFilteredRows(rowValues);
//     };
//     fetcher();
//   }, []);

//   return (
//     <div className={style.dataGrid}>
//       <Box sx={{ height: 1180, width: "100%" }}>
//         <DataGrid
//           rows={filteredRows}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: {
//                 pageSize: 10,
//               },
//             },
//           }}
//           pageSizeOptions={[5]}
//           disableRowSelectionOnClick
//           rowHeight={100}
//           slots={{
//             toolbar: GridToolbar,
//           }}
//         />
//       </Box>
//     </div>
//   );
// }

export default function DataGridApprover() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosService = new AxiosService();

  useEffect(() => {
    const fetcher = async () => {
      let data = await axiosService.getAllUploads();
      let rowValues = data.data.map((e) => ({
        id: e.id,
        Image: e.files,
        ProductName: {
          name: e.typeOfFurniture,
          desc: e.description,
          date: dateTimeFormateer(e.date),
        },
        Description: e.description,
        Location: e.location,
        DonorInfo: {
          name: e.fullName,
          mail: e.email,
        },
        Phone: e.phone,
        Status: { status: e.status, id: e.id },
        Reviewer: e.location,
        Recipient: {
          name: e.recName,
          contact: e.recContact,
          recDate: e.recipientReceivedDate,
          itemStatus: e.itemStatus,
        },
      }));
      setRows(rowValues);
      setFilteredRows(rowValues);
    };
    fetcher();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) => {
        return Object.entries(row).some(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return Object.values(value).some((v) =>
              v && typeof v.toString === "function"
                ? v.toString().toLowerCase().includes(term)
                : false
            );
          }
          return value && typeof value.toString === "function"
            ? value.toString().toLowerCase().includes(term)
            : false;
        });
      });
      setFilteredRows(filtered);
    }
  };
  return (
    <div>
      <div className={style.dataGrid}>
        <TextField
          fullWidth
          placeholder="Search across all fields..."
          value={searchTerm}
          onChange={handleSearch}
          className={style.search}
          style={{ marginBottom: 20, padding: 10 }}
        />
        <Box sx={{ width: "100%", height: "1100px" }}>
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
            pageSizeOptions={[5, 10, 25, 50, 100]}
            disableRowSelectionOnClick
            rowHeight={100}
          />
        </Box>
      </div>
    </div>
  );
}
