import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import PlayGroundHeader from "./PlayGroundHeader";
import { Sun, Moon, ArrowDownToLine,WandSparkles } from 'lucide-react';
import Editor from '@monaco-editor/react';
import "../App.css";

export default function PlayGround() {
  const { theme, setTheme } = useContext(ThemeContext); 
  const DarkMode = theme === 'dark'; 

 const Languages = [
        {
            id: 92,
            name: "Python (3.11.2)",
            code: `print("Hello, World!")`,
            extension:"py",
            lang:"python"
        },
        {
            id: 91,
            name: "Java (JDK 17.0.6)",
            code: `public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}`,
            extension:"java",
            lang:"python"
        },
        {
            id: 105,
            name: "C++ (GCC 14.1.0)",
            code: `#include <iostream>\nint main() {\n\tstd::cout << "Hello, World!" << std::endl;\n\treturn 0;\n}`,
            extension:"cpp",
            lang:"cpp"
        },
        {
            id: 103,
            name: "C (GCC 14.1.0)",
            code: `#include <stdio.h>\nint main() {\n\tprintf("Hello, World!\\n");\n\treturn 0;\n}`,
        extension:"c",
        lang:"c"
        },
        {
            id: 97,
            name: "JavaScript (Node.js 20.17.0)",
            code: `console.log("Hello, World!");`,
            extension:"js",
            lang:"javascript"
        },
        {
            id: 106,
            name: "Go (1.22.0)",
            code: `package main\nimport "fmt"\nfunc main() {\n\tfmt.Println("Hello, World!")\n}`,
            extension:"go",
            lang:"go"
        },
        {
            id: 83,
            name: "Swift (5.2.3)",
            code: `print("Hello, World!")`,
            extension:"swift",
            lang:"swift"

        }
        ];
    const [Ind, setInd] = useState(2);
    const [Code, setCode] = useState(Languages[2].code);
    const [IsRunning, setIsRunning] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setinput] = useState('');
    const [output, setoutput] = useState('');
    let token = useRef('');

    let editorOptions = {
        fontSize: 17,
        wordWrap: 'on',
        fontFamily: "'Courier New', 'Fira Code', 'JetBrains Mono', monospace"
    };

    let PostData = async () => {
        const url = 'https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=true';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': '1f57df6755msh40eb8b15b1bdd58p127c32jsnc39b6e226f90',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify( {
                submissions: [
                    {
                        language_id: Languages[Ind].id,
                        source_code: btoa(Code),
                        stdin: btoa(input)
                    }
                ]
            })
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            token.current=result[0].token;
            return {"error":false};
        } catch (error) {
            console.error(error);
            return {"error":true};
        }
    };

    let getData = async () => {
        const url = `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${token.current}&base64_encoded=true&fields=*`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '1f57df6755msh40eb8b15b1bdd58p127c32jsnc39b6e226f90',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
        }
    };

    function needsInput(code, lang) {
        const patterns = {
            python: [/input\(/],
            cpp: [/\bcin\b/, /scanf\(/],
            c: [/scanf\(/],
            java: [/Scanner\s*\w+\s*=/],
            javascript: [/prompt\(/],
            go: [/fmt\.Scanf\(/],
            swift: [/readLine\(/],
        };

        const checks = patterns[lang.toLowerCase()];
        if (!checks) return false;

        return checks.some((regex) => regex.test(code));
                
     }

    let runCode = async () => {
        setIsRunning(true);
        setoutput("");
        const currentLang = Languages[Ind];
        const codeNeedsInput = needsInput(Code, currentLang.lang);
        if (codeNeedsInput && input.trim() === "") {
            alert("This code expects input, but no input was provided.");
            setIsRunning(false);
            return;
        } else {
                    setTimeout(() => setoutput("Request In Queue...."), 300);
           let postRes=await PostData();
           if(postRes.error){
            setIsRunning(false);
            setoutput("Server Error");
            return;
           }
            let status_code = 1;
            let result;
            while (status_code === 1 || status_code === 2) {
                result = await getData();
                const submission = result?.submissions?.[0];
                if (!submission) {
                setoutput("Submission data not available");
                setIsRunning(false);
                return;
                }
                status_code = submission.status_id;
                if (status_code === 2) setoutput("Request Processing....");
            }
            if (result.submissions[0].stdout) setoutput(atob(result.submissions[0].stdout));
            else if (result.submissions[0].compile_output) setoutput(atob(result.submissions[0].compile_output));
        }
        setIsRunning(false);
    };

    let Spinner = () => <div className="loader" style={{
                                                    border: `3px solid ${DarkMode?'#f3f3f3':'white'}`,
                                                    borderTop: `3px solid ${DarkMode?'#3498db':'gray'}`,
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    animation: 'spin 1s linear infinite'
                        }}></div>;

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${DarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <PlayGroundHeader />

        <div className="flex flex-1 overflow-hidden">
            {/* Left Editor */}
            <div className={`w-[60%] flex flex-col border-r-4 overflow-hidden ${DarkMode ? 'bg-gray-900 border-white' : 'bg-white border-black'}`}>
            <header className={`flex justify-end items-center p-2 border-2 border-t-0 border-r-0 ${DarkMode ? 'bg-gray-800 border-white' : 'bg-gray-200 border-black'}`}>
                <div className={`absolute left-2 p-3 border-r-2 ${DarkMode ? 'text-white border-white' : 'text-gray-700 border-black'}`}>
                main.{Languages[Ind].extension}
                </div>

                <button className="mr-2 border-2 border-gray-500 p-1">
                <WandSparkles color={DarkMode ? "#ffffff" : "#000000"} />
                </button>

                <button className="mr-2 border-2 border-gray-500 p-1">
                <ArrowDownToLine color={DarkMode ? "#ffffff" : "#000000"} />
                </button>

                {/* Language Dropdown */}
                <div className="relative text-sm sm:text-xs md:text-xs mr-2 h-9">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-52 ${DarkMode ? 'text-white bg-gray-800 hover:bg-gray-700 border-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border-black'} font-normal rounded px-2 py-1 text-left border`}
                >
                    {Languages[Ind].name}
                    <svg className="w-2 h-7 inline ml-1" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>

                {isOpen && (
                    <div className={`z-10 mt-1 absolute w-full rounded shadow border ${DarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-300'}`}>
                    <ul className="p-1 space-y-1 max-h-60 overflow-y-auto scroll-hidden text-sm">
                        {Languages.map((val, ind) => (
                        <li key={val.id}>
                            <label className={`flex items-center p-1.5 rounded hover:cursor-pointer ${DarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-black'}`}>
                            <input
                                type="radio"
                                name="language"
                                value={val.name}
                                checked={Ind === ind}
                                onChange={() => {
                                setInd(ind);
                                setCode(Languages[ind].code);
                                setIsOpen(false);
                                }}
                                className={`w-3.5 h-3.5 ${DarkMode ? 'bg-gray-900 border-gray-600 text-blue-500' : 'bg-white border-gray-300'}`}
                            />
                            <span className="ml-2">{val.name}</span>
                            </label>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </div>

                {/* Toggle Button */}
                <button className="mr-2 border-2 border-gray-500 p-1" onClick={() => setTheme(DarkMode ? 'light' : 'dark')}>
                {DarkMode ? <Sun color="#ffffff" /> : <Moon />}
                </button>

                <button className={`${DarkMode?'bg-blue-700 hover:bg-blue-500':'bg-black hover:bg-gray-600'} p-2 w-16 h-9 text-white font-bold flex items-center justify-center mr-2`} onClick={runCode}>
                {IsRunning ? <Spinner /> : 'Run'}
                </button>
            </header>

            {/* Editor */}
            <div className="w-full flex flex-1">
                <Editor
                key={Ind}
                height="100%"
                width="100%"
                language={Languages[Ind].lang}
                options={editorOptions}
                value={Code}
                onChange={(val) => setCode(val)}
                theme={DarkMode ? 'vs-dark' : 'vs-light'}
                />
            </div>
            </div>

            <div className={`w-[40%] flex flex-col ${DarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Input Box */}
            <div className={`h-[35%] ${DarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`flex justify-between ${DarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 items-center'} items-center`}>
                    <p className="text-base p-2 font-normal">Input</p>
                    <button className={`text-sm w-15 h-7 p-3 font-light cursor-pointer border-2 flex items-center justify-center mr-2 text-center  ${DarkMode?'text-white  border-gray-400':'text-black  border-gray-600'}`} onClick={() => setinput("")}>
                        Clear
                    </button>                
                </div>
                <textarea
                cols={120}
                className={`w-full flex-1 resize-none h-[100%] scroll-hidden border-2 focus:border-0 ${DarkMode ? 'bg-vscode text-white border-black' : 'bg-white text-black border-gray-300'}`}
                value={input}
                onChange={(e) => setinput(e.target.value)}
                />
            </div>

            {/* Output Box */}
            <div className={`h-[65%] ${DarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`flex justify-between ${DarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} flex-1 items-center`}>
                <p className="text-base p-2 font-normal">Output</p>
                <button className={`text-sm w-15 h-7 p-3 font-light cursor-pointer border-2 flex items-center justify-center mr-2 text-center  ${DarkMode?'text-white  border-gray-400':'text-black  border-gray-600'}`} onClick={() => setoutput("")}>
                    Clear
                </button>
                </div>
                <textarea
                cols={120}
                className={`w-full flex-1 resize-none h-[100%] font-tt font-medium scroll-hidden border-2 focus:border-0 ${DarkMode ? 'bg-vscode text-white border-black' : 'bg-white text-black border-gray-300'}`}
                value={output}
                readOnly
                />
            </div>
            </div>
        </div>
        </div>
    );
}
