"use client";
import style from "./index.module.css";
import { useState } from "react";
import { locationsData } from "../../../pages/donate/getFurniture/[location]";
import { Eye, EyeOff } from "react-feather";
const InputField = ({ placeholder, height, onChange, name, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      {type == "text" && (
        <input
          required
          className={style.inputs}
          name={name}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          style={{ height: height }}
        ></input>
      )}
      {type == "password" && (
        <div className={style.passwordContainer}>
          <input
            required
            className={`${style.inputs}`}
            name={name}
            onChange={onChange}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            style={{ height: height }}
          />
          <div
            className={style.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye
                style={{ border: "none", color: "rgba(121, 117, 114, 1)" }}
              ></Eye>
            ) : (
              <EyeOff
                style={{ border: "none", color: "rgba(121, 117, 114, 1)" }}
              ></EyeOff>
            )}
          </div>
        </div>
      )}

      {type == "text-area" && (
        <textarea
          className={style.inputs + " " + style.input2}
          required
          name={name}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          style={{ height: height }}
        ></textarea>
      )}

      {type == "dropdown" && (
        <select name="location" className={style.inputs} onChange={onChange}>
          <option className={style.inputs}>LOCATION</option>
          {locationsData.map((option, index) => (
            <option className={style.inputs} key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

export default InputField;
