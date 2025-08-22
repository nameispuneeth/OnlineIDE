import { useLocation } from "react-router-dom";
import "../../index.css";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext, useRef, useState } from "react";

export default function OtpPage() {
  const { theme } = useContext(ThemeContext);
  const DarkMode = theme === "dark";
  const { state } = useLocation();
  const [value, setValue] = useState(Array(6).fill("")); 
  const email = useRef(state.email);
  const purpose = useRef(state.purpose);


  const handleChange = (i, val) => {
    if (val === "" || (/^[0-9]$/.test(val))) {
      const newArr = [...value];
      newArr[i] = val;
      setValue(newArr);
    }
  };

  let VerifyOTP=()=>{

  }
  return (
    <div
      className={`${
        DarkMode ? "bg-gray-900" : "bg-gray-100"
      } h-screen flex flex-col justify-center items-center`}
    >
      <div className="flex gap-2 justify-center items-center">
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i}
            type="text"
            maxLength="1"
            value={value[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className={`h-16 w-12 sm:h-20 sm:w-16 text-2xl sm:text-3xl border-2 ${
            DarkMode
            ? 'bg-gray-600 text-white border-gray-900'
            : 'bg-gray-300 text-black border-gray-100'
        } rounded text-center`}
          />
        ))}
      </div>
      <div>
<input
  type="submit"
  value="Verify"
  className={`w-full mt-10 p-3  border-2 font-semibold mb-5 text-white 
    ${DarkMode 
      ? 'border-blue-700 hover:bg-blue-500 bg-blue-700' 
      : 'border-black hover:bg-gray-900 bg-black'
    }`}
    onClick={()=>VerifyOTP()}
 />
      </div>
    </div>
  );
}
