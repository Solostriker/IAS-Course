import { selectedAssignmentAtom, userAtom } from "@/pages/api/data"
import { useAtom } from "jotai"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { IoOpenOutline, IoTrashBinOutline} from "react-icons/io5"
import {BiEdit} from "react-icons/bi"
import { OnDelete } from "../OnDelete"
import AssignmentModal from "../AssignmentModal"

export default function AssignmentDisplay (props:any) {
    const content = JSON.parse(props.content)
    const [deleteModal, setDeleteModal] = useState(false)
    const [user, ] = useAtom(userAtom)
    const [, setSelectedAssi] = useAtom(selectedAssignmentAtom)
    const router = useRouter()
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)

    const marginTopFunc = () => {
        if (!props.first) {
            return {marginTop: "15px"}            
        } else {
            return {}
        }
    }    

    function onExpand () {
        setSelectedAssi(props.val)
        if (user.isOrganization) {
            router.push("/ViewAssignmentTeacher")
        }
        else {
            router.push("/ViewAssignmentStudent")
        }    
    }

    function getDate () {
        const d = new Date(props.date)
        return d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
    }

    function onDelete (){
        setDeleteModal(true)
    }

    function onEdit (){
        setIsCreateOpen(true)
    }



    return (
        <div className="animation-all duration-300 w-[100%] gap-2 rounded-[15px] border-2 pad-[3px] hover:border-orange-300 hover:shadow-around-s flex flex-col p-3" style={marginTopFunc()}>
            <div className="flex flex-row justify-between">
                <p className="text-[13px] font-bold max-h-[20px] text-ellipsis">{content[0].content}</p>
                <div className="flex flex-row justify-end gap-2">
                    <button onClick={onExpand}>
                        <IoOpenOutline className="h-[20px] w-[20px]" />
                    </button>
                    {user.isOrganization && <>
                        <AssignmentModal
                            isOpen={isCreateOpen}
                            setIsOpen={setIsCreateOpen}
                            editVal={props.val}
                        />

                        <button onClick={onEdit}>
                            <BiEdit className="h-[18px] w-[18px] mt-[2px]"/>                
                        </button>

                        <OnDelete val={props.val} isOpen={deleteModal} setIsOpen={setDeleteModal} />
                        <button onClick={onDelete}>
                            <IoTrashBinOutline className="h-[18px] w-[18px] mt-[2px]"/>
                        </button>
                    </>}    
                </div>
            </div>

            <p className="text-[10px] text-neutral-600">{content[1].content}</p>
            <div className="flex flex-row justify-between">
                <p className="text-[10px] text-neutral-400">{props.organizationName} · {props.moduleName}</p>
                <p className="text-[10px] text-neutral-400">Created {getDate()}</p>
            </div>
        </div>
    )

    // return (
    //     <div className="animation-all duration-300 w-[100%] h-[80px] rounded-[15px] relative border-2 pad-[3px] hover:border-orange-300 hover:shadow-around-s" style={marginTopFunc()}>
    //         {/* Left side */}
    //         <p className="absolute bottom-[5px] left-[10px] text-[10px]">{props.organizationName} · {props.moduleName}</p>
    //         <p className="absolute top-[5px] left-[10px] text-[13px] font-bold">{content[0].content}</p>
    //         <p className="absolute top-[25px] left-[10px] text-[10px] text-neutral-600">{content[1].content}</p>

    //         {/* Right side */}
    //         <button className="absolute top-[10px] right-[10px]" onClick={onExpand}>
    //             <IoOpenOutline className="" />
    //         </button>
    //         {user.isOrganization && <>

    //             <AssignmentModal
    //                 isOpen={isCreateOpen} 
    //                 setIsOpen={setIsCreateOpen}
    //                 editVal={props.val}
    //             />

    //             <button className="absolute top-[10px] right-[50px]" onClick={onEdit}>
    //                 <BiEdit/>                
    //             </button>
    //             <OnDelete val={props.val} isOpen={deleteModal} setIsOpen={setDeleteModal} />
    //             <button className="absolute top-[10px] right-[30px]" onClick={onDelete}>
    //                 <IoTrashBinOutline className=""/>
    //             </button>
    //         </>}       

    //         <p className="absolute bottom-[5px] right-[13px] text-[10px] text-neutral-400">Created {getDate()}</p>

            

    //     </div>
    // )
}