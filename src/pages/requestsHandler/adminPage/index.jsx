"use client";
import style from "./index.module.css";
import { useState, useEffect } from "react";
import DataGridApprover from "@/components/newMolecules/DGApprover";
import AxiosService from "@/lib/services/axios";
import DataGridEmailApprover from "@/components/newMolecules/DGEmail";
import DataGridTestimonialApprover from "@/components/newMolecules/DGTestimonials";

const AdminPage = () => {
  const [item, setItem] = useState("approveImageHandler");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const axiosService = new AxiosService();

    const checkAuthentication = async () => {
      try {
        const response = await axiosService.getMyProfile();
        console.log(response);
        if (response && response.isAdmin) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <>
      {!authenticated ? (
        // <form onSubmit={handleLogin} className={style.formDiv}>
        //   <div className={style.formDivinside}>
        //     <label htmlFor="username">Username:</label>
        //     <input
        //       type="text"
        //       id="username"
        //       value={username}
        //       onChange={(e) => setUsername(e.target.value)}
        //       className={style.input}
        //       required
        //     />
        //   </div>
        //   <div className={style.formDivinside}>
        //     <label htmlFor="password">Password:</label>
        //     <input
        //       type="password"
        //       id="password"
        //       value={password}
        //       className={style.input}
        //       onChange={(e) => setPassword(e.target.value)}
        //       required
        //     />
        //   </div>
        //   <div className={style.formDivinside1}>
        //     <input
        //       type="checkbox"
        //       id="rememberMe"
        //       checked={rememberMe}
        //       onChange={(e) => setRememberMe(e.target.checked)}
        //     />
        //     <label htmlFor="rememberMe">Remember Me</label>
        //   </div>
        //   {error && <p style={{ color: "red" }}>{error}</p>}
        //   <button type="submit" className={style.btn1 + " " + style.btn55}>
        //     Login
        //   </button>
        // </form>
        <h1 style={{ marginLeft: 50, marginTop: 50 }}>Not authenticated</h1>
      ) : (
        <>
          <button
            onClick={() => {
              setItem("approveImageHandler");
            }}
            className={item == "approveImageHandler" ? style.btn1 : style.btn2}
            style={{ marginLeft: 0, marginBottom: 50 }}
          >
            Approve Image
          </button>

          {/* <button
            onClick={() => {
              setItem("emailHandler");
            }}
            className={item == "emailHandler" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Email Handler
          </button> */}

          {/* <button
            onClick={() => {
              setItem("testimonialHandler");
            }}
            className={item == "testimonialHandler" ? style.btn1 : style.btn2}
            style={{ marginLeft: 50, marginBottom: 50 }}
          >
            Testimonial Handler
          </button> */}

          {/* <button
            onClick={handleLogout}
            className={style.btn1}
            style={{ position: "absolute", right: "50px" }}
          >
            Logout
          </button> */}
          <br />

          {item == "approveImageHandler" && <DataGridApprover />}
          {/* {item == "emailHandler" && <DataGridEmailApprover />} */}
          {/* {item == "testimonialHandler" && <DataGridTestimonialApprover />} */}
        </>
      )}
    </>
  );
};

export default AdminPage;
