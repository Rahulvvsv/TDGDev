"use client";
import style from "./index.module.css";
import InputField from "../../atoms/inputField";
import Button from "../../atoms/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import { updateDocument } from "@/lib/firebase";

const ReceipientForm = ({
  images,
  productName,
  name,
  description,
  itemStatus,
  productId,
}) => {
  const [data, setData] = useState({ itemStatus: itemStatus });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  const dataSetter = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData((prev) => ({ ...prev, recipientReceivedDate: startDate }));
    //console.log(data);
    if (validateForm()) {
      //console.log(data, startDate);
      // upLoadData(data);
      setSubmitted(true);
    } else {
      toast.error("Form is invalid, please check your inputs");
    }
  };
  useEffect(() => {
    if (submitted) {
      updateDocument(productId, data);
    }
  }, [submitted]);
  useEffect(() => {
    updateDocument(productId, { itemStatus: itemStatus });
    if (itemStatus == "donorFound") {
      updateDocument(productId, { status: itemStatus });
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate full name
    if (!data.recName || data.recName.trim() === "") {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    // Validate phone
    if (!data.recContact || data.recContact.trim() === "") {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  if (itemStatus != "donorFound") {
    return (
      <div className={style.mainFound}>
        <h1>Thank you for updating the status of your donation!</h1>
      </div>
    );
  } else {
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
                <Image
                  alt=" "
                  src={images[0]}
                  className={style.imageInside}
                  fill
                />
              </div>

              <div className={style.main890}>
                <h1 className={style.heading}>Donor Name: {name}</h1>
                <h1 className={style.heading}>Furniture Name: {productName}</h1>
                <h1 className={style.heading}>Description: {description}</h1>
              </div>
              <br />
            </div>

            <motion.div className={style.right}>
              <br />
              <InputField
                onChange={dataSetter}
                placeholder={"RECIPIENT'S NAME*"}
                name={"recName"}
              />
              {errors.fullName && (
                <div className={style.error}>{errors.fullName}</div>
              )}

              <InputField
                onChange={dataSetter}
                placeholder={"RECIPIENT'S CONTACT DETAILS*"}
                name={"recContact"}
              />
              {errors.phone && (
                <div className={style.error}>{errors.phone}</div>
              )}

              <DatePicker
                className={style.datepicker}
                selected={startDate}
                name={"recipientReceivedDate"}
                onChange={(date) => setStartDate(date)}
              />
              {errors.desc && <div className={style.error}>{errors.desc}</div>}

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
              Thank you for Updating the recipient Details.
            </h1>
          </motion.div>
        )}
      </div>
    );
  }
};

export default ReceipientForm;
