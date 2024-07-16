import React from "react"
import Modal from "react-modal"
import { interFont } from "@/pages";
import { IoClose } from "react-icons/io5";
import { useAtom } from "jotai";
import { addModule, modulesAtom } from "@/pages/api/data";
import { userAtom } from "@/pages/api/data";
import { useRouter } from "next/router";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    height: "70%",
    borderRadius: 25,
  },
};

export default function CreateModule (props:any) {
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [error, setError] = React.useState("")
    const [user, ] = useAtom(userAtom)
    const [modules, setModules] = useAtom(modulesAtom)
    
    async function createModule () {
        if (title === "") {
            setError("Please add a title.")
            return
        }
        if (user.docOrganizationId === "") {
            setError("Error! Invalid doc organization id!")
            return
        }

        const data = await addModule(user.docOrganizationId, title, description)         

        setModules([...modules, data])

        props.setIsOpen(false) 
    }

    return (
        <Modal 
            isOpen={props.isOpen}  
            onRequestClose={() => props.setIsOpen(false)}
            style={customStyles}
            ariaHideApp={false}
        >
            <IoClose className='absolute top-[15px] right-[15px] h-[20px] w-[20px] cursor-pointer z-10' onClick={() => {props.setIsOpen(false)}} />
            <div style={interFont.style}>
                <p className="text-[12px] relative w-[300px] left-[35px] top-[20px] mt-[20px]">Enter title:</p> 
                <input 
                    onInput={(event:any) => {setTitle(event.target.value as string)}}
                    type="text" 
                    className="text-xs relative left-[35px] mt-[25px] w-[calc(100%-70px)] p-[5px] outline outline-1 outline-gray-300 rounded-[5px] " placeholder="Title"  
                />

                <p className="text-[12px] relative w-[300px] left-[35px] top-[20px]">Enter description (optional):</p> 
                <textarea 
                    onInput={(event:any) => {setDescription(event.target.value as string)}}
                    className="text-xs relative left-[35px] mt-[25px] w-[calc(100%-70px)] p-[5px] outline outline-1 outline-gray-300 rounded-[5px] min-h-[23px]" placeholder="Content"  
                />

                <p className="text-[10px] text-red-500 relative w-[300px] left-[35px] mt-[10px]">{error}</p> 

                <button className="relative w-[140px] h-[30px] left-[50%] translate-x-[-50%] mt-[20px] text-[12px] rounded-[15px] bg-blue-500 text-white transition-all duration-300 hover:shadow-around" onClick={createModule}>Create Module</button>

            </div>

            <h1 style={interFont.style} className="absolute top-[9px] w-full left-0 text-center text-[20px]">Create Module</h1> 
        </Modal>
    )
}