import { ThemeContext } from "../../contexts/ThemeContext";
import { Sun, Moon} from 'lucide-react';

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
export default function UserHomeHeader(){
    const { theme, setTheme } = useContext(ThemeContext);
    const DarkMode = theme === 'dark';
    const navigate=useNavigate();
    return(
        <>
           <header className={`w-full ${DarkMode?'bg-gray-900 text-white':'bg-white text-black'}  p-4 relative flex justify-between`}>
                <div className="right-2 top-2">
                    <p className="font-tt text-3xl font-bold cursor-pointer" onClick={()=>navigate("/")}>OnlineIDE</p>
                </div>
                <div className="left-2 top-2 bottom-2">
                    <button className="mr-2 border-2 border-gray-500 p-2 rounded-3xl" onClick={() => setTheme(DarkMode ? 'light' : 'dark')}>
                        {DarkMode ? <Sun color="#ffffff" /> : <Moon />}
                    </button>
                    
                </div>
            </header>

        </>
    );
}