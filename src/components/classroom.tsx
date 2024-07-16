import React, { useState } from "react"
import { didCompletedAssi, modulesAtom, selectedAssignmentAtom, userAtom } from "@/pages/api/data"
import { useAtom } from "jotai"
import { assignmentsAtom, sortAssignmentsByDate, sortAssignmentsByType as sortAssignmentsByModule} from "@/pages/api/data"
import { useRouter } from "next/router"
import { interFont } from "@/pages";
import { IoTrashBinOutline } from "react-icons/io5"
import {OnDelete} from "./OnDelete"
import {BiEdit} from "react-icons/bi"
import AssignmentModal from "./AssignmentModal"

function Assignment (props:any) {
    const router = useRouter()    
    const [ , setSelectedAssi] = useAtom(selectedAssignmentAtom)
    const [user, ] = useAtom(userAtom)
    const content = JSON.parse(props.content)
    const [deleteMod, setDeleteModal] = React.useState(false)
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)

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
            {user.isOrganization &&
            <>
                <button className="absolute top-[50%] translate-y-[-50%] right-[15px] text-[12px] p-[5px] px-[10px] border-2 border-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white rounded-[15px]" onClick={expand}>
                    View
                </button>
                <button className="absolute top-[50%] translate-y-[-50%] right-[75px] text-[15px] p-[5px] px-[10px] border-2 border-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white rounded-[15px]" onClick={() => setDeleteModal(true)}>
                    <IoTrashBinOutline/>
                </button>

                <OnDelete 
                  isOpen={deleteMod}
                  setIsOpen={setDeleteModal}
                  val={props.val}
                />
            
                <AssignmentModal
                  isOpen={isCreateOpen} 
                  setIsOpen={setIsCreateOpen}
                  editVal={props.val}
                />

                <button className="absolute top-[50%] translate-y-[-50%] text-[15px] right-[125px] p-[5px] px-[10px] border-2 border-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white rounded-[15px]" onClick={() => setIsCreateOpen(true)}>
                    <BiEdit/>                
                </button>
            </>}
        </div>
    )
}

export default function Classroom () {
    const [user, ] = useAtom(userAtom)
    const [modules, ] = useAtom(modulesAtom)
    const [assignments, ] = useAtom(assignmentsAtom)
    const [displayAssignments, setDisplayAssignments] = useState<React.JSX.Element[]>([]);

    function filterBy(filter: string, assignments: any[]) {
        if(filter === "date"){
           const sortedAssignments: React.JSX.Element[] = sortAssignmentsByDate(assignments, user.userId, false).map((value:any, index:number) => {
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
            })

            setDisplayAssignments(sortedAssignments)
        
        }else if(filter === "module"){
            const sortedAssignments: React.JSX.Element[] = sortAssignmentsByModule(assignments, user.userId, false).map((value:any, index:number) => {
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
            })

            setDisplayAssignments(sortedAssignments)

        }

      }

    return (
        <div className="absolute left-[180px] right-[20px] h-[100%] overflow-y-auto" style={interFont.style}>
            <h1 className="font-bold absolute top-[15px] w-full text-center text-[25px]">{user.organizationName} Classroom</h1>

            <div className="absolute right-[16%] top-[70px] w-[70px] h-[25px] bg-neutral-100 text-[12px] rounded-[15px] cursor-pointer transition-all duration-300 hover:shadow-around-s border-2 border-neutral-300">
                <select className="w-full text-center relative top-[50%] translate-y-[-50%]" onChange = {(e)=>{
                    filterBy(e.target.value, assignments);
                }}>
                    <option disabled selected value = "">Filter By</option>     
                    <option value = "date">Date</option>
                    <option value = "module">Module</option>
                </select>    
            </div>            

            <div className="absolute left-[10px] top-[95px] bottom-[10px] right-[10px]">
                {displayAssignments.length ? displayAssignments : sortAssignmentsByDate(assignments, user.userId, false).map((value:any, index:number) => {
                    return (<Assignment 
                        date={value.date} 
                        type={value.type}
                        val={value}
                        moduleName={modules[value.moduleId].title} 
                        organizationName={user.organizationName} 
                        content={value.content} 
                        key={index}
                    />)
                })}
                <br />
            </div>
        </div>
    ) 
}