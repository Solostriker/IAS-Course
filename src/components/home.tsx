import React, { useEffect, useState } from "react";
import { interFont } from "@/pages";
import { IoClose } from "react-icons/io5"
import Calendar from "./calendar";
import {useAtom} from "jotai"
import { userAtom, assignmentsAtom, getOrganizationInfo, modulesAtom, sortAssignmentsByDate } from "@/pages/api/data";
import AssignmentModal from "./AssignmentModal";
import CreateModule from "./CreateModule";
import Assignment from "./HomeHelper/AssignmentsDisplay";
import Module from "./HomeHelper/ModuleDisplay"

function dictsDifferent (origDict:any, newDict:any) {
    if (origDict.length != newDict.length) return true
    for (var i = 0; i < origDict.length; i++) {
        var arr = Object.keys(origDict[i])
        if (arr.length !== Object.keys(newDict[i]).length) return true

        for (var x = 0; x < arr.length; x++)  {
            if (JSON.stringify(origDict[i][arr[x]]) !== JSON.stringify(newDict[i][arr[x]])) return true
        }
    }
    return false
}

export default function Home (props:any) {
    const [user, ] = useAtom(userAtom)
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [moduleModalOpen, setModuleModalOpen] = React.useState(false)
    const [assignments, setAssignments] = useAtom(assignmentsAtom)
    const [modules, setModules] = useAtom(modulesAtom)
    const [error, setError] = React.useState("")
    const [dateSelected, setDateSelected] = React.useState<Date>(undefined as any)
    const [moduleSelected, setModuleSelected] = React.useState(-1)

    async function updateAssigments () {
        if (user.docOrganizationId !== "") {
            const [newAssign, newModules] = await getOrganizationInfo(user.docOrganizationId)
            if (dictsDifferent(assignments, newAssign))
                setAssignments(newAssign.slice())
            if (dictsDifferent(modules, newModules))
                setModules(newModules.slice())
        }
    }

    useEffect(() => {updateAssigments()}, [user]) 

    function filter (dict:any) {
        // filter by module
        var c = dict

        var result:any = []
    
        c.forEach((element:any) => {
            const d = new Date(element.date)
            if ((moduleSelected === -1 || moduleSelected === element.moduleId) && 
                (dateSelected == undefined || dateSelected.getFullYear() == d.getFullYear() && 
                dateSelected.getDate() == d.getDate() && 
                dateSelected.getMonth() == d.getMonth())) {
                result.push(element)
            }
        });
        
        return result
    }

    function assignmentsOpen () {
        if (modules.length === 0) {
            setError("Add a module before adding an assignments!")
            return
        }
        setIsCreateOpen(true)
    }

    function selectModuleName (value:any) {
        if (value.moduleId < modules.length)
            return modules[value.moduleId].title
        else
            return ""
    }

    return (
        <div style={interFont.style}>
            {/* Title */}
            <h1 className="position font-bold absolute top-[15px] left-[190px] text-[25px]">Hello {user.username}!</h1>
            <p className="position absolute top-[50px] left-[190px] text-[12px]">{user.isOrganization ? <>Organization ID: {user.organizationId}</> : <>Let's start learning!</>}</p>

            {/* Stats */}

            <div className="bg-white absolute left-[190px] top-[80px] h-[60px] w-[120px] transition-all duration-300 border-2 hover:border-blue-200 hover:shadow-around-s rounded-[25px] cursor-pointer">
                <p className="absolute left-[45px] text-center top-[50%] translate-y-[-50%] text-[10px]">consecutive<br/>days</p>
                <p className="absolute left-[10px] w-[30px] top-[50%] translate-y-[-50%] font-bold text-[15px] text-center" >23</p>
            </div>

            <div className="bg-white absolute left-[330px] top-[80px] h-[60px] w-[100px] transition-all duration-300 border-2 hover:border-blue-200 hover:shadow-around-s rounded-[25px] cursor-pointer">
                <p className="absolute left-[45px] text-center top-[50%] translate-y-[-50%] text-[10px]">hours<br/>trained</p>
                <p className="absolute left-[10px] w-[30px] top-[50%] translate-y-[-50%] font-bold text-[15px] text-center">3</p>
            </div>

            <div className="bg-white absolute left-[450px] top-[80px] h-[60px] w-[103px] transition-all duration-300 border-2 hover:border-blue-200 hover:shadow-around-s rounded-[25px] cursor-pointer">
                <p className="absolute left-[48px] text-center top-[50%] translate-y-[-50%] text-[10px]">overall<br/>progress</p>
                <p className="absolute left-[10px] w-[30px] top-[50%] translate-y-[-50%] font-bold text-[15px] text-center">99%</p>
            </div>


            {/* Assigments */}
            <p className="absolute top-[165px] left-[190px] text-[16px]">Assignments:</p>

            {user.isOrganization ? <>
                <button onClick={assignmentsOpen} className="absolute top-[163px] left-[425px] text-[12px] p-[5px] px-2 rounded-[15px] bg-green-400 transition-all duration-300 hover:shadow-around text-white">Create Assignment</button>

                <AssignmentModal isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
            </> : <>
                <button onClick={updateAssigments} className="absolute top-[163px] left-[490px] text-[12px] p-[5px] px-2 rounded-[15px] border-2 transition-all duration-300 hover:shadow-around hover:border-green-300">Refresh</button>
            </>}

            <div className="absolute left-[180px] w-[400px] top-[200px] bottom-[10px] overflow-y-auto overflow-x-visible px-[10px]">
                {filter(sortAssignmentsByDate(assignments, user.userId, true)).map((value:any, index:number) => {
                    return (<Assignment 
                        key={index}
                        type={value.type}
                        date={value.date} 
                        val={value}
                        content={value.content}
                        moduleName={selectModuleName(value)} 
                        organizationName={user.organizationName} 
                    />)
                })}      
            </div>

            {/* Calendar */}
            <Calendar datePressed={setDateSelected} />

            {/* Add Teachers down below (with chat button) */}  
            <p className="absolute left-[610px] top-[420px] text-[20px]">Modules:</p> 
            
            {user.isOrganization && <>
                <button onClick={() => {setModuleModalOpen(true)}} className="absolute right-[30px] top-[423px] text-[12px] p-[5px] px-2 rounded-[15px] bg-green-400 transition-all duration-300 hover:shadow-around text-white">Create Module</button>

                <CreateModule isOpen={moduleModalOpen} setIsOpen={setModuleModalOpen} />
            </>}

            {/* Modules */}
            <div className="absolute left-[590px] p-[15px] top-[460px] right-[30px] direction-column items-start flex">
                {modules.map((element:any, index:number) => {
                    return (<Module 
                        key={index} 
                        ind={index}
                        description={element.description} 
                        title={element.title} 
                        selected={moduleSelected}
                        setSelected={setModuleSelected}
                    />)
                })} 
            </div>

            {/* Error message */}
            {error !== "" && 
                <div className="absolute left-[50%] translate-x-[-50%] w-[430px] bottom-[10px] h-[30px] bg-red-500 shadow-around-xl  rounded-[30px]">
                    <p className="text-white relative left-[0px] top-[50%] translate-y-[-50%] w-full text-center text-[14px]">{error}</p>
                    <IoClose className="absolute top-[50%] translate-y-[-50%] right-[8px] h-[20px] w-[20px] cursor-pointer" color="white" onClick={() => setError("")} />
                </div>
            }
            
        </div>
    )
}