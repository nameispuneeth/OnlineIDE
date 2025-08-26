import UserHomeHeader from "./UserHomeHeader";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext, useEffect, useState,useRef } from "react";
import Swal from "sweetalert2";
import Card from "./Card";

export default function UserHome() {
    const { theme } = useContext(ThemeContext);
    const [userName, setUserName] = useState("");
    const [userCodes, setUserCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const userExists=useRef(false);
    const getUserCodes = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch("https://codebite.onrender.com/api/getUserData", {
                    method: "GET",
                    headers: {
                        "authorization": token,
                        "content-type": "application/json"
                    }
                });
                const data = await response.json();
                if (data.status === "ok") {
                    userExists.current=true;
                    setLoading(false);
                    setUserCodes(data.codes);
                    setUserName(data.userName);
                } else {
                    Swal.fire({
                        title: "Error",
                        icon: "error",
                        text: "Unable to fetch user data.",
                        confirmButtonColor: `${DarkMode ? '#1d4ed8' : 'black'}`,
                        background: `${DarkMode ? '#1e1e1e' : 'white'}`,
                    });
                }
            } catch (error) {
                setLoading(false);
                console.error("Error fetching codes:", error);
            }
        } else {
            setLoading(false);
            alert("Login to view your codes.");
        }
    };

    const handleDelete = (id) => {
        setUserCodes((prevCodes) => prevCodes.filter(code => code._id !== id));
    };

    useEffect(() => {
        getUserCodes();
    }, []);

    const DarkMode = theme === 'dark';

    let ShowUserData = () => {
        return (
            <>


                {userCodes.map((data) => (
                    <Card
                        key={data._id}
                        data={data}
                        handleDelete={handleDelete}

                    />
                ))}
            </>
        );
    }
        let NoData = () =>{
            return(
                <div className="p-10">
<p>
    {loading ? " Loading ..." : "No Saved Files To Display"}
    </p>
        </div>
            );
        }

    let Helper1=()=>{
        return(
            <>
            {loading ?" ":"No User Credentials"}
            </>
        )
    }
    return (
        <div className={`min-h-screen w-full ${DarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'} relative`}>
            {loading &&
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            }
            <UserHomeHeader />
            <div className="font-tt p-1">

                <div className="ml-2 sm:text-4xl font-bold text-2xl mt-4">
                    {!userExists.current
                        ? Helper1()                        : `Welcome Back, ${userName}`}
                </div>
                <div className={`mt-12 sm:text-2xl text-xl mb-12`}>
                    <p className="ml-2">Your Saved Files:</p>
                    <div className="flex justify-center items-center">
                        <div className={`mt-5 w-[95%] border-2 rounded flex flex-wrap gap-4 overflow-x-auto justify-center items-center ${DarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}>
                            {Object.keys(userCodes).length === 0 ? NoData() : ShowUserData()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
