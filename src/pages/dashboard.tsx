import React from "react";
import { interFont } from ".";
import Image from "next/image";
import Classroom from "../components/classroom";
import {
    IoHomeOutline, 
    IoPersonOutline, 
    IoEaselOutline, 
    IoLogOutOutline,

    IoHome,
    IoPerson,
    IoEasel,
} from "react-icons/io5"
import Home from "@/components/home";
import Profile from "@/components/profile";
import { useRouter } from "next/router";
import { assignmentsAtom, userAtom, handleLogOut } from "./api/data";
import { useAtom} from "jotai"

export default function Dashboard () {
    const [selected, setSelected] = React.useState(0)
    const [, setUser] = useAtom(userAtom)
    const [, setAssigments] = useAtom(assignmentsAtom)
    const router = useRouter()

    function Selector () {
        if (selected == 0)
            return <Home />
        else if (selected == 1)
            return <Classroom />
        else
            return <Profile/>
    }
    
    async function logOut () {
        handleLogOut((e:any)=>setUser(e), (e:any)=>setAssigments(e))
        router.replace("/")
    }

    return (
        <div className="" style={interFont.style}>
            {/* Side Menu */}
            <div className="bg-green-100 absolute ml-3 mt-3 h-[calc(100%-25px)] w-[150px] shadow-around-l rounded-[25px]">
                <Image src="/ias.ico" width={70} height={70} alt="Loading" className='relative left-[50%] translate-x-[-50%] top-3' />

                <button className="transition-all relative w-[75%] h-[40px] left-[50%] translate-x-[-50%] rounded-full top-[25px] box-content" onClick={() => setSelected(0)}>
                    {selected == 0 ? 
                        <IoHome className="relative left-[15px]"/>
                    : 
                        <IoHomeOutline className="relative left-[15px]"/>
                    } 
                    <p className="absolute top-[50%] translate-y-[-50%] left-[40px] text-[12px]">Home</p>
                </button>

                <button className="transition-all relative w-[75%] h-[40px] left-[50%] translate-x-[-50%] rounded-full top-[25px] box-content" onClick={() => setSelected(1)}>
                    {selected == 1 ? 
                        <IoEasel className="relative left-[15px]"/>
                    : 
                        <IoEaselOutline className="relative left-[15px]"/>
                    } 
                    <p className="absolute top-[50%] translate-y-[-50%] left-[40px] text-[12px]">Classroom</p>
                </button>

                <button className="transition-all relative w-[75%] h-[40px] left-[50%] translate-x-[-50%] rounded-full top-[25px] box-content" onClick={() => setSelected(2)}>
                    {selected == 2 ? 
                        <IoPerson className="relative left-[15px]"/>
                    : 
                        <IoPersonOutline className="relative left-[15px]"/>
                    } 
                    <p className="absolute top-[50%] translate-y-[-50%] left-[40px] text-[12px]">Profile</p>
                </button>

                <button className="transition-all absolute w-[75%] h-[40px] left-[50%] translate-x-[-50%] rounded-full bottom-[10px] box-content" onClick={logOut}>
                    <IoLogOutOutline className="relative left-[15px]"/>
                    <p className="absolute top-[50%] translate-y-[-50%] left-[40px] text-[12px]">Log out</p>
                </button>

            </div>
                
            <Selector /> 

        </div>        
    ) 
}
