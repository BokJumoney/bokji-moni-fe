// import maintitle from "../../assets/title.png"
import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Input.css";

export default function Input({type="text", placeholder, value, onChange}){
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    return (
        <div className="input-container">
            <input
                className={"input-field"} 
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />

            {type === "password" && (
                <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
        </div>
    );
}