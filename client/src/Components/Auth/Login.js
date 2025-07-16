import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { CircleAlert } from 'lucide-react';


export default function Login() {
    const { theme } = useContext(ThemeContext);
    const DarkMode = theme === 'dark';
    const errorMsg=useRef('');
    const [email, setemail] = useState('');
    const [pwd, setpwd] = useState('');
    const [Invalid, setInvalid] = useState(false);
    let HandleSubmission = async (e) => {
        e.preventDefault();

        let Response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, pwd
            })
        })

        let data = await Response.json();

        if (data.status === 'ok') {
            //Navigate To Home.js
            alert("User Exists");
        } else {
            setInvalid(true);
            errorMsg.current=data.error;
        }
    }
    let ErrorMsg = () => {
        return (
            <div className="border-2 border-red-900 w-full gap-3 p-2 rounded bg-red-900 flex mb-5 ">
                <CircleAlert color='#ffffff' />
                <p className="text-white font-sans font-extralight">{errorMsg.current}</p>
            </div>
        )
    }
    return (
        <div className="h-screen bg-black">
            <div className="flex justify-center items-center h-full w-full">
                <div className={`${DarkMode ? 'bg-vscode' : 'bg-white'} p-6 rounded shadow-md`}>
                    <p className="flex justify-center mb-10 font-extrabold text-5xl text-blue-700">LOGIN</p>
                    <form onSubmit={HandleSubmission}>
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => {
                                setemail(e.target.value);
                                setInvalid(false);
                            }}
                            className={`w-full mb-7 p-2 border-3 rounded ${DarkMode ? 'border-gray-700 bg-transparent text-gray-400' : 'border-vscode text-black'}`}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            value={pwd}
                            onChange={(e) => {
                                setpwd(e.target.value);
                                setInvalid(false);
                            }}
                            className={`w-full p-2 border-3 mb-9 rounded ${DarkMode ? 'border-gray-700 bg-transparent text-gray-400' : 'border-vscode text-black'}`}
                            required
                        />
                        <input type="submit" value="Login" className={`w-full p-2 border-2 font-semibold mb-5 text-white ${DarkMode ? 'border-blue-700 hover:bg-blue-500 bg-blue-700 ' : 'border-black hover:bg-gray-700 bg-black'}`}></input>

                        {Invalid && ErrorMsg()}

                        <p className="flex justify-center font-light text-sm text-white">Don't Have An Account ?  <span className="ml-1 cursor-pointer font-semibold text-blue-500"> Register </span> </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
