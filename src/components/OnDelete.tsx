import Modal from "react-modal"
import React from "react"
import { assignmentsAtom, deleteAssignment, deleteUserAccount , userAtom } from "@/pages/api/data";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { auth } from "../../firebase";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "500px",
    height: "250px",
    borderRadius: 25,
  },
};

export function DeleteAccount (props:any) {
    const [user, setUser] = useAtom(userAtom)
    const [, setAssigments] = useAtom(assignmentsAtom)

    const router = useRouter()

    async function stateChange (shouldDelete:boolean) {
        if (shouldDelete) {
            await deleteUserAccount(user.userId)
            await auth.signOut() 
        setUser({
            username: "",
            userId: "",
            language: "",
            isOrganization: false,
            organizationId: "",
            organizationName: "",
            docOrganizationId: ""
        })
        setAssigments([] as any)
            router.push("/")
        }
        props.setIsOpen(false);
    }

    return (
        <Modal 
            isOpen={props.isOpen}    
            onRequestClose={() => {props.setIsOpen(false)}}
            style={customStyles}
            ariaHideApp={false}
        >
            <h1 className="w-full text-center text-[20px] font-bold">Are you sure you want to delete your account?</h1>
            
            <button onClick={() => stateChange(true)} className="text-[22px] relative left-[20px] top-[30px] bg-red-500 text-white w-[200px] h-[100px] rounded-[10px] hover:shadow-around-l transition-all">Yes</button>

            <button onClick={() => stateChange(false)} className="text-[22px] relative left-[40px] top-[30px] bg-blue-500 text-white w-[200px] h-[100px] rounded-[10px] hover:shadow-around-l transition-all">No</button>
        </Modal>
    )
}

export function OnDelete (props:any) {
    const [user, ] = useAtom(userAtom)
    const [assignments, setAssignments] = useAtom(assignmentsAtom)

    async function stateChange (shouldDelete:boolean) {
        if (shouldDelete) {
            await deleteAssignment(props.val, user.docOrganizationId)
            var ind = assignments.indexOf(props.val) 

            var copy = [...assignments]
            copy.splice(ind, 1)
            setAssignments(copy.slice())
        }
        props.setIsOpen(false);
    }

    return (
        <Modal 
            isOpen={props.isOpen}    
            onRequestClose={() => {props.setIsOpen(false)}}
            style={customStyles}
            ariaHideApp={false}
        >
            <h1 className="w-full text-center text-[20px] font-bold">Are you sure you want to delete this assignment?</h1>
            
            <button onClick={() => stateChange(true)} className="text-[22px] relative left-[20px] top-[30px] bg-red-500 text-white w-[200px] h-[100px] rounded-[10px] hover:shadow-around-l transition-all">Yes</button>

            <button onClick={() => stateChange(false)} className="text-[22px] relative left-[40px] top-[30px] bg-blue-500 text-white w-[200px] h-[100px] rounded-[10px] hover:shadow-around-l transition-all">No</button>
        </Modal>
    )
}