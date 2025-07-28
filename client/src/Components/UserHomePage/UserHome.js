import UserHomeHeader from "./UserHomeHeader";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext, useEffect, useState } from "react";
import Card from "./Card";

export default function UserHome() {
    const { theme } = useContext(ThemeContext);
    const [userName, setUserName] = useState("");
    const [userCodes, setUserCodes] = useState([]);

    const getUserCodes = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch("http://localhost:8000/api/getUserData", {
                    method: "GET",
                    headers: {
                        "authorization": token,
                        "content-type": "application/json"
                    }
                });
                const data = await response.json();
                if (data.status === "ok") {
                    setUserCodes(data.codes);
                    setUserName(data.userName);
                } else {
                    alert("Unable to fetch user data.");
                }
            } catch (error) {
                console.error("Error fetching codes:", error);
            }
        } else {
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

    return (
        <div className={`min-h-screen w-full ${DarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
            <UserHomeHeader />
            <div className="font-tt p-1">
                <div className="ml-2 sm:text-4xl font-bold text-2xl mt-4">
                    Welcome Back, {userName}
                </div>
                <div className={`mt-12 sm:text-2xl text-xl mb-12`}>
                    <p className="ml-2">Your Saved Files:</p>
                    <div className="flex justify-center items-center">
                        <div className={`mt-5 w-[95%] border-2 rounded flex flex-wrap gap-4 overflow-x-auto justify-center items-center ${DarkMode ? 'bg-gray-700' : 'bg-gray-400'}`}>
                            {userCodes.map((data) => (
                                <Card
                                    key={data._id}
                                    data={data}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
