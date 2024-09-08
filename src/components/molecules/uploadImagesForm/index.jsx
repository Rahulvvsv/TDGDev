"use client";
import style from "./index.module.css";
import InputField from "../../atoms/inputField";
import Button from "../../atoms/button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { upLoadData } from "../../../lib/firebase";
import AxiosService from "../../../lib/services/axios";
import toast from "react-hot-toast";

const UploadForm = () => {
  const [data, setData] = useState({});
  let captcha = useRef(null);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const axiosService = new AxiosService();

  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(objectUrls);

    // Free memory when this component is unmounted or files change
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const imageFiles = Array.from(e.target.files);
    if (imageFiles.length + files.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...imageFiles]);
    setData((prevData) => ({
      ...prevData,
      image: [...files, ...imageFiles],
    }));
  };

  const handleImageNavigation = (direction) => {
    if (direction === "left") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? previewUrls.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === previewUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      //console.log(data)
      //upLoadData(data);
      axiosService.uploadUserImages(data);
      setSubmitted(true);
    } else {
      toast.error("Form is invalid, please check your inputs");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate full name
    if (!data.fullName || data.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!data.image || data.image.length === 0) {
      newErrors.images = "At least one image is required";
      isValid = false;
    }

    // Validate email
    if (!data.email || data.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Validate phone
    if (!data.phone || data.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(data.phone.trim())) {
      // assuming a 10-digit phone number
      newErrors.phone = "Invalid phone number";
      isValid = false;
    }

    // Validate location
    if (!data.location || data.location.trim() === "") {
      newErrors.location = "Location is required";
      isValid = false;
    }

    // Validate exact location
    if (!data.address || data.address.trim() === "") {
      newErrors.address = "Exact location is required";
      isValid = false;
    }

    // Validate type of furniture
    if (!data.typeOfFurniture || data.typeOfFurniture.trim() === "") {
      newErrors.typeOfFurniture = "Type of furniture is required";
      isValid = false;
    }

    // Validate description
    if (!data.description || data.description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div>
      {!submitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={style.main}
        >
          <div className={style.left}>
            <div className={style.imageUpload}>
              {previewUrls.length > 0 && (
                <>
                  {previewUrls.length > 1 && (
                    <div className={style.navbuttondiv}>
                      <button
                        onClick={() => handleImageNavigation("left")}
                        className={style.navButton}
                      >
                        {"<"}
                      </button>
                      <button
                        onClick={() => handleImageNavigation("right")}
                        className={style.navButton}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                  <Image
                    alt=" "
                    src={previewUrls[currentImageIndex]}
                    className={style.imageInside}
                    fill
                  />
                </>
              )}
              <label htmlFor="files" className={style.inputs123}>
                <Image alt=" " src={"/Icon/plus.png"} width={78} height={78} />
              </label>
              <input
                name="images"
                onChange={handleImageChange}
                id="files"
                style={{ visibility: "hidden" }}
                accept="image/*"
                type="file"
                multiple
              />
              <h1 className={style.heading}>UPLOAD IMAGES (Max 4)</h1>
            </div>
            <br />
            {previewUrls.length > 0 && (
              <p className={style.heading}>
                Current Image : {currentImageIndex + 1}/{previewUrls.length}
              </p>
            )}
            {errors.images && (
              <div className={style.error}>{errors.images}</div>
            )}

            {previewUrls.length > 0 && previewUrls.length && (
              <div className={style.uploadMoreImages}>
                <label htmlFor="files" className={style.inputs999}>
                  <h1>Upload More Images</h1>
                </label>
                <input
                  name="images"
                  onChange={handleImageChange}
                  id="files"
                  style={{ visibility: "hidden" }}
                  accept="image/*"
                  type="file"
                  multiple
                />
              </div>
            )}
          </div>

          <motion.div className={style.right}>
            <InputField
              onChange={dataSetter}
              placeholder={"FULL NAME*"}
              name={"fullName"}
            />
            {errors.fullName && (
              <div className={style.error}>{errors.fullName}</div>
            )}
            <InputField
              onChange={dataSetter}
              placeholder={"EMAIL*"}
              name={"email"}
            />
            {errors.email && <div className={style.error}>{errors.email}</div>}
            <InputField
              onChange={dataSetter}
              placeholder={"PHONE*"}
              name={"phone"}
            />
            {errors.phone && <div className={style.error}>{errors.phone}</div>}
            <InputField
              placeholder={"LOCATION*"}
              name={"location"}
              onChange={dataSetter}
              type="dropdown"
            />
            {errors.location && (
              <div className={style.error}>{errors.location}</div>
            )}
            <InputField
              onChange={dataSetter}
              placeholder={"ADDRESS*"}
              name={"address"}
            />
            {errors.address && (
              <div className={style.error}>{errors.address}</div>
            )}
            <InputField
              onChange={dataSetter}
              placeholder={"TYPE OF FURNITURE*"}
              name={"typeOfFurniture"}
            />
            {errors.typeOfFurniture && (
              <div className={style.error}>{errors.typeOfFurniture}</div>
            )}
            <InputField
              onChange={dataSetter}
              placeholder={"DESCRIBE YOUR FURNITURE*"}
              name={"description"}
              type="text-area"
            />
            {errors.description && (
              <div className={style.error}>{errors.description}</div>
            )}
            <Button
              onClick={handleSubmit}
              placeholder={"SUBMIT"}
              content={"SUBMIT"}
              href={""}
              fontColor={"white"}
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={style.main2}
        >
          <Image alt=" " src={"/Icon/4.png"} width={190} height={190} />
          <h1 className={style.heading1}>
            Thank you for your offer to donate. Someone will be in touch with
            next steps. Your generosity is appreciated!
          </h1>
        </motion.div>
      )}
    </div>
  );
};

export default UploadForm;
