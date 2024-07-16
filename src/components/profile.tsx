import React from "react";
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import {assignmentsAtom, userAtom, modulesAtom, sortAssignmentsByDate, selectedAssignmentAtom, didCompletedAssi} from "@/pages/api/data"
import {DeleteAccount, OnDelete} from "./OnDelete"
import { IoTrashBinOutline } from "react-icons/io5"
import {ChangeUserName, UpdatePassword} from "./manageAccount"

function Assignment (props:any) {
    const router = useRouter()    
    const [ , setSelectedAssi] = useAtom(selectedAssignmentAtom)
    const [user, ] = useAtom(userAtom)
    const content = JSON.parse(props.content)
    const [deleteMod, setDeleteModal] = React.useState(false)

    const marginTopFunc = () => {
        if (!props.first) {
            return {marginTop: "15px"}            
        } else {
            return {}
        }
    }    

    function getDate () {
        const d = new Date(props.date)
        return d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
    }

    function expand () {
        setSelectedAssi(props.val)
        if (user.isOrganization) {
            router.push("/ViewAssignmentTeacher")
        }
        else {
            router.push("/ViewAssignmentStudent")
        }
    }

    return (
        <div className="animation-all duration-300 left-[50%] translate-x-[-50%] w-[70%] rounded-[15px] relative border-2 pad-[3px] hover:border-blue-300 hover:shadow-around-s" style={marginTopFunc()}>
            {/* Left side */}
            <p className="relative top-[5px] left-[10px] text-[18px] font-bold">{content[0].content}</p>
            <p className="relative mt-[8px] left-[10px] text-[12px]">{content[1].content}</p>
            <p className="relative mt-[8px] mb-[5px] left-[10px] text-[10px] text-neutral-500">{props.moduleName} · Created {getDate()}</p>

            {(!didCompletedAssi(user.userId, props.val) || props.type !== 1) && !user.isOrganization &&  
                <button className="absolute top-[50%] translate-y-[-50%] right-[15px] text-[12px] p-[5px] px-[10px] border-2 border-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white rounded-[15px]" onClick={expand}>
                    View
                </button>
            }
            {user.isOrganization && <>
                <button className="absolute top-[50%] translate-y-[-50%] right-[15px] text-[12px] p-[5px] px-[10px] border-2 border-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white rounded-[15px]" onClick={expand}>
                    View
                </button>
                <button className="absolute top-[50%] translate-y-[-50%] right-[80px]" onClick={() => setDeleteModal(true)}>
                    <IoTrashBinOutline/>
                </button>

                <OnDelete 
                isOpen={deleteMod}
                setIsOpen={setDeleteModal}
                val={props.val}
                />
            </>}
        </div>
    )

}

interface Button{
    style: string,
    onClick: (e:object)=>void,
    account: object,
    text: string
}

export function Button(props: Button):React.JSX.Element{
    return(
        <button 
        className={props.style}
        onClick = {()=>props.onClick(props.account)}
        >
            {props.text}
        </button>
    ) 
}

export default function Profile(){
    const [assignments, ] = useAtom(assignmentsAtom)
    const [modules, ] = useAtom(modulesAtom)
    const [user, ] = useAtom(userAtom)
    const [deleteMod, setDeleteModal] = React.useState(false)
    const [expandChangeUserName, setExpandChangeUserName] = React.useState(false)
    const [expandUpdatePassword, setExpandUpdatePassword] = React.useState(false)

    return(
        <div className="position absolute left-[180px] right-[20px] h-[100%] overflow-y-auto" >
            <h1 className="position absolute font-bold absolute top-[15px] left-[60px] text-[25px]">Profile</h1>

                <h2 className = "position absolute font-bold absolute top-[45px] left-[60px] text-[25px]">Welcome {user.username}</h2>


                <h2 className = "font-bold absolute top-[115px] w-full text-center text-[25px]">Your Completed Assignments</h2>
                <section className="position absolute left-[10px] top-[155px] bottom-[10px] right-[10px]">
                    {sortAssignmentsByDate(assignments, user.userId, false).map((value:any, index:number) => {
                       return (<Assignment 
                        date={value.date} 
                        type={value.type}
                        val={value}
                        moduleName={modules[value.moduleId].title} 
                        title={value.title} 
                        organizationName={user.organizationName}    
                        content={value.content} 
                        key={index}
                    />)
                })}
                </section>

                <section className = "flex-row justify-around relative flex left-[10px] top-[340px] ">

                {Button({style: "mb-5 relative text-[12px] p-[5px] px-2 rounded-[15px] border-2 transition-all duration-300 hover:shadow-around hover:border-green-300", account: user, onClick: ()=> setDeleteModal(true), text: "Delete Account"})}

                <DeleteAccount
                    isOpen={deleteMod}
                    setIsOpen={setDeleteModal}
                    val={user.userId}
                />

                {Button({style: "mb-5 relative text-[12px] p-[5px] px-2 rounded-[15px] border-2 transition-all duration-300 hover:shadow-around hover:border-green-300", account: user, onClick: ()=> setExpandChangeUserName(!expandChangeUserName), text: "Update UserName"})}

                {Button({style: "mb-5 relative text-[12px] p-[5px] px-2 rounded-[15px] border-2 transition-all duration-300 hover:shadow-around hover:border-green-300", account: user, onClick: ()=> setExpandUpdatePassword(!expandUpdatePassword), text: "Update Password"})}

                </section>

                <section className = "absolute top-[400px] flex justify-around w-full">
                    <ChangeUserName expandChangeUserName = {expandChangeUserName}/>

                    <UpdatePassword expandUpdatePassword= {expandUpdatePassword}/>
                </section>



        </div>
    )
}
