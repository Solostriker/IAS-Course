import React from "react"
import { useAtom } from "jotai"
import {userAtom, updateUserPassword, updateUserName, handleLogOut, assignmentsAtom} from "../pages/api/data"
import { useRouter } from "next/router";


export function ChangeUserName(expandChangeUserName:any){
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [errorMsg, setErrorMsg] = React.useState("")
    const [, setAssignments] = useAtom(assignmentsAtom)
    const [user, setUser] = useAtom(userAtom)

    const router = useRouter();

    // 2S07TJ2BFebcQ1N7LEwpw5tbhF73
    // "5yjrP"
    // "test"
    // userId
    // "2S07TJ2BFebcQ1N7LEwpw5tbhF73"
   async function handleChangeUserName(){
        setErrorMsg("")
        await updateUserName(username, user.docOrganizationId)

       handleLogOut((e:any)=>setUser(e),(e:any)=>setAssignments(e))

        if (username == "") {
            // set error message somewhere
            setErrorMsg("Username must be filled")
            return
        }    
    }

    return(
        <div className = {`transition transition-duration: 10s flex flex-col items-center ${expandChangeUserName.expandChangeUserName ? "opacity-100" : "opacity-0"}`}>

            <p className="text-center w-full text-[12px] relative">Change your username:</p> 
            <h3 className="text-center w-full text-[18px] relative">Current User Name: {user.username} </h3>
            <input 
                onInput={(event:any) => {setUsername(event.target.value as string)}}
                className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[10px] outline outline-1 outline-gray-300 rounded-[5px]" 
                placeholder="Username"  
            />

            <button onClick = {(event: any)=>handleChangeUserName()} className="mt-5 text-[12px] bg-blue-500 text-white w-[200px] h-[55px] rounded-[10px] hover:shadow-around-l transition-all">Change UserName</button>
        </div>
    )
}



export function UpdatePassword(expandUpdatePassword:any){
    const [password, setPassword] = React.useState("")
    const [errorMsg, setErrorMsg] = React.useState("")
    const [user, setUser] = useAtom(userAtom)
 
    const router = useRouter()

    return(
        <div className = {`transition transition-duration: 10s flex flex-col items-center ${expandUpdatePassword.expandUpdatePassword ? "opacity-100" : "opacity-0"}`}>

            <p className="text-center w-full text-[12px] relative">Change your password:</p> 
            <input 
                type = "password"
                onInput={(event:any) => {setPassword(event.target.value as string)}}
                className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[10px] outline outline-1 outline-gray-300 rounded-[5px]" 
            />

            <button onClick = {(event: any)=>{updateUserPassword(password)
                router.push("/")
            }} className="mt-5 text-[12px] top-[140px] bg-blue-500 text-white w-[200px] h-[55px] rounded-[10px] left-[50%] hover:shadow-around-l transition-all">Update Password</button>
        </div>
    )
}
