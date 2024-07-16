import Image from "next/image"
import React from "react"
import { interFont } from ".."
import Link from "next/link"
import { auth } from "../../../firebase"
import { UserCredential, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/router"
import { organizationExists, initOrganization, initUser } from "../api/data"
import { userAtom } from "../api/data"
import { useAtom } from "jotai"

import { FaChalkboardTeacher } from "react-icons/fa"
import { BsFillPersonFill } from "react-icons/bs"
import LangModal from "@/components/LangModal"

export default function signUpPage () {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [organizationId, setOrganizationPrompt] = React.useState("")
    const [errorMsg, setErrorMsg] = React.useState("")
    const [language, setLanguage] = React.useState("")
    const [langModal, setLangModal] = React.useState(false)
    const [, setIsLoading] = React.useState(false)
    const [, setUser] = useAtom(userAtom)
    const [type, setType] = React.useState("")
    const router = useRouter()

    async function signUp () { 
        setErrorMsg("")
        if (username == "") {
            // set error message somewhere
            setErrorMsg("Username must be filled")
            return
        }

        if (password == "") {
            // set error message somewhere 
            setErrorMsg("Password must be filled")
            return
        }

        if (type === "organization" && language === "") {
            setErrorMsg("Please select a language")            
            return
        }

        var docId:string
        if (type == "student") {
            docId = await organizationExists(organizationId)
            if (docId == "") {
                setErrorMsg("Organization doesn't exist")
                return
            }
        }


        await createUserWithEmailAndPassword(auth, username+"@gmail.com", password)
            .then(async (value:UserCredential) => {
                var result:any
                if (type == "student") result = await initUser(username, value.user.uid, docId)
                else if (type == "organization") result = await initOrganization(username, value.user.uid, organizationId, language)
                setUser(result)
                router.replace("/dashboard")
            })
            .catch((error:any) => {
                setIsLoading(false) 

                switch (error.code) {
                    case "auth/email-already-in-use":
                        setErrorMsg("Username already in use! Pick a different username.") 
                        break;

                    case "auth/invalid-email":
                        setErrorMsg("Invalid email.") 
                        break;

                    case "auth/weak-password":
                        setErrorMsg("Set a more complicated password!")
                        break;
                }
            })
    }

    function goBack () {
        if (type == "") {
            router.replace("/")
        } else {
            setErrorMsg("")
            setType("")
        }
    }

    function heightStyle () {
        if (type == "") 
            return {
                height: 270
            } 
        else if (type === "student") {
            return {
                height: 330
            }
        }
        else 
            return {
                height: 415
            }
    } 
    
    return (
        <div style={interFont.style} className="w-full h-full bg-emerald-200 absolute">
            <Image src="/ias.ico" width={100} height={100} alt="Loading" className='absolute left-[50%] translate-x-[-50%] top-[13px]' />

            <div className="transition-all duration-300 w-[400px] bg-white absolute left-[50%] top-[100px] translate-x-[-50%] rounded-[30px]"
                style={heightStyle()} 
            >
                <button className="absolute bg-slate-200 rounded-full h-[30px] w-[60px] left-[15px] top-[20px] text-[10px] text-center z-10 hover:bg-slate-300 transition-all duration-500" onClick={goBack}>Go back</button>
                <p className="text-[20px] relative w-full text-center top-[20px]">Sign up</p> 
                {type != "" ? <>
                    <p className="text-[12px] relative w-[300px] left-[50px] top-[20px] mt-[30px]">Enter username:</p> 
                    <input 
                        onInput={(event:any) => {setUsername(event.target.value as string)}}
                        className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[5px] outline outline-1 outline-gray-300 rounded-[5px]" 
                        placeholder="Username"  
                    />


                    <p className="text-[12px] relative w-[300px] left-[50px] top-[20px]">Enter password:</p> 
                    <input 
                        onInput={(event:any) => {setPassword(event.target.value as string)}}
                        type="password" 
                        className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[5px] outline outline-1 outline-gray-300 rounded-[5px]" placeholder="Password"  
                    /> <br />

                    <p className="text-[12px] relative w-[300px] left-[50px] top-[20px]">Enter Organization {type == "student" ? <>ID</> : <>Name</>}:</p> 
                    <input 
                        onInput={(event:any) => {setOrganizationPrompt(event.target.value as string)}}
                        type="text" 
                        className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[5px] outline outline-1 outline-gray-300 rounded-[5px]" placeholder={type == "student" ? "Organization ID" : "Organizaton Name"}
                    /> <br />

                    {type === "organization" && <>
                        <p className="text-[12px] relative w-[300px] left-[50px] top-[20px]">Enter Language:</p> 
                        <button className="relative mt-[25px] left-[50px] text-[10px] px-[10px] bg-slate-200 py-[5px] rounded-full" onClick={() => setLangModal(true)}>{language === "" ? <>Select Language</> : <>Language: {language.split("|")[0]}</>}</button>  
                        <LangModal isOpen={langModal} setIsOpen={setLangModal} setLang={setLanguage} />
                    </>}

                    <p className="relative left-[50px] text-[10px] text-red-600 top-[5px] ">{errorMsg}</p>
                    <button onClick={signUp} className="text-[12px] absolute bottom-[25px] bg-blue-500 text-white w-[80px] h-[25px] rounded-[10px] left-[50%] translate-x-[-50%] hover:shadow-around-l transition-all">{type == "" ? <>Next</> : <>Submit</>}</button>

                </> : <>
                    <p className="text-[12px] relative w-full mt-[30px] text-center">Are you a student or organization?</p> 
                    <div className="absolute top-[100px] left-[20px] h-[150px] right-[calc(50%+10px)] bg-blue-400 rounded-[15px] transition-all hover:shadow-around-xl" onClick={() => {setType("student")}}>
                        <p className="absolute bottom-[10px] w-full text-center text-[12px] text-white">Student</p>
                        <BsFillPersonFill className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[60px] w-[60px]" color="white" />
                    </div>

                    <div className="absolute top-[100px] right-[20px] h-[150px] left-[calc(50%+10px)] bg-orange-400 rounded-[15px] transition-all hover:shadow-around-xl" onClick={() => {setType("organization")}}>
                        <p className="absolute bottom-[10px] w-full text-center text-[12px] text-white">Organization</p>
                        <FaChalkboardTeacher className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[60px] w-[60px]" color="white" />
                    </div>
                </>}
            </div> 

        </div>
    )
}
