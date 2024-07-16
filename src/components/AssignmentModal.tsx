import React, { useEffect, useState} from "react"
import Modal from "react-modal"
import { interFont } from "@/pages";
import { IoClose } from "react-icons/io5";
import { useAtom } from "jotai";
import { addAssignment, assignmentsAtom, deleteAssignment, getImage, modulesAtom, uploadImage, userAtom } from "@/pages/api/data";
import Editable, { ImageEmbed, LeftSelect, Question, YoutubeEmbed } from "./Editable";
import axios from "axios"

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "90%",
    borderRadius: 25,
  },
};

export default function AssignmentModal (props:any) {
    const [selectedModule, setSelectedModule] = useState(0)
    const [assignments, setAssignments] = useAtom(assignmentsAtom)
    const [modules, ] = useAtom(modulesAtom)
    const [content, setContent] = useState([{id:-1, content:""}, {id:0, content:""}] as any[])
    const [origContent, setOrigContent] = useState([] as any[])
    const [user, ] = useAtom(userAtom)
    const [error, setError] = useState("")
    const [editContent, setEditContent] = useState(undefined as any)
    const [msg, setMsg] = useState("Translate")

    // const serverURL = "https://edulangbackend.azurewebsites.net/translateText"
    
    const editValue = props.editVal
    
    useEffect(() => {
        async function x () { 
            if (editValue != undefined) {
                var c = JSON.parse(editValue.content)
                setContent(c)
                setEditContent(c)
            }
        } 
        x()

    }, [props.editContent])
    
    async function translate () {
        const c = content.slice()        

        if (c[0].content === "") {
            setError("Please enter title!")
            return
        }
        if (c[1].content === "") {
            setError("Please enter description!")
            return
        }

        setMsg("Uploading...")

        for (var i = 0; i < c.length; i++) {
            if (c[i].id === 3 && c[i].content === "") {
                setError("Please enter Youtube URL")
                setMsg("Submit")
                return
            }
        }       

        setMsg(`Translating to ${user.language.split("|")[0]}...`)        

        var msg = ""
        for (var i = 0; i < content.length; i++) {
            if (content[i].id == 0 || content[i].id == 1 || content[i].id == -1 || content[i].id == 5) {
                // heading, normal text, title
                msg += content[i].content + "|"
            }
            else if (content[i].id == 2) {
                msg += content[i].content.question + "|"
                for (var x = 0; x < content[i].content.choices.length; x++) {
                    msg += content[i].content.choices[x] + "|"
                }
            }
            else if (content[i].id == 5) {
                msg += content[i].content.question
            }
        }


        const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${user.language.split("|")[1]}&dt=t&q=${msg}`)
        const result = res.data[0][0][0].split('|')
        
        var count = 0;
        
        var copyContent = JSON.parse(JSON.stringify(content))
        for (var i = 0; i < copyContent.length; i++) {
            if (copyContent[i].id == 0 || copyContent[i].id == 1 || copyContent[i].id == -1 || copyContent[i].id == 5) {
                // heading, normal text, title
                copyContent[i].content = result[count]
                count++
            }
            else if (copyContent[i].id == 2) {
                copyContent[i].content.question = result[count]
                count++
                for (var x = 0; x < copyContent[i].content.choices.length; x++) {
                    copyContent[i].content.choices[x] = result[count]
                    count++
                }
            }
            else if (content[i].id == 4) {
                copyContent[i].content = content[i].content
            }
        }

        setOrigContent(c)
        setContent(copyContent.slice())
        
        setMsg("Submit")
    }

    async function submit () {
        // delete the assignment if we have edit content
        if (editValue != undefined) {
            await deleteAssignment(editValue, user.docOrganizationId)
            const editContent = JSON.parse(editValue.content)
            var ind = assignments.indexOf(editContent)

            var copy = [...assignments]
            copy.splice(ind, 1)
            setAssignments(copy.slice())

        }

        var c = origContent.slice()           // orig language ; user input
        var translatedC = content.slice()     // original lang ; google translated values
                    
        // === actual upload ===  
        // upload any images that we might have
        for (var i = 0; i < c.length; i++) {
            if (c[i].id === 4) {
                // is valid image, we have to upload
                const img = content[i].content as File
                console.log(img.name)
                const imgUUID = await uploadImage(img)  
                c[i].content = imgUUID
                translatedC[i].content = imgUUID
            }
        }
        

        var str = JSON.stringify(c)
        var strTranslated = JSON.stringify(translatedC)

        const data = await addAssignment(
            user.docOrganizationId, 
            str,
            strTranslated,
            selectedModule
        )

        setAssignments([...assignments, data])

        props.setIsOpen(false)
    }

    function addContent (data:any) {
        data['vid'] = content.length
        setContent([...content, data])
    }

    function setContentHelper (ind:number, key:string, value:any) {
        var copy = content
        copy[ind][key] = value
        setContent(copy.slice())
    }

    function deleteContent (ind:number) {
        var copy = content
        copy.splice(ind, 1)
        setContent(copy.slice())
    }

    // quesiton
    function addChoice (ind:number) {
        var copy = content
        copy[ind].content.choices.push("")
        setContent(copy.slice())
    }
    function setChoices (ind:number, qInd:number, c:string) {
        var copy = content
        copy[ind].content.choices[qInd] = c
        setContent(copy.slice())
    }
    function setQuestion (ind:number, c:string) {
        var copy = content
        copy[ind].content.question = c
        setContent(copy.slice())
    }
    function setQuestionChecked (ind:number, qInd:number) {
        var copy = content
        copy[ind].content.checked = qInd
        setContent(copy.slice())
    }

    useEffect(() => {
        console.log("assignment module: ", content)
    }, [content])
    
    return (
        <Modal 
            isOpen={props.isOpen}    
            onRequestClose={() => {props.setIsOpen(false)}}
            style={customStyles}
            ariaHideApp={false}
        >
            <IoClose className='absolute top-[15px] right-[15px] h-[20px] w-[20px] cursor-pointer z-10' onClick={() => {props.setIsOpen(false)}} />

            <h1 style={interFont.style} className="absolute top-[15px] w-full left-0 text-center text-[20px]">{props.editVal != undefined ? <>Edit</> : <>Create</>} Assignment</h1>

            <div className='absolute w-[200px] h-[calc(100%-40px)] top-[40px] left-0 overflow-y-auto' style={interFont.style}>
                {/* Assigment type selection*/}
                <p className="w-full text-center text-[14px] mt-[25px]">Module:</p>                

                {modules.map((element:any, index:number) => {
                    return ( 
                        <LeftSelect key={index} selected={selectedModule == index} onClick={() => setSelectedModule(index)}>{element.title}</LeftSelect>
                    )
                })}

                {msg != "Submit" && <>
                    <p className="w-full text-center text-[14px] mt-[35px]">Add:</p>                

                    <LeftSelect selectHover onClick={() => addContent({id: 0, content: ""})}>Description</LeftSelect>
                    <LeftSelect selectHover onClick={() => addContent({id: 1, content: ""})}>Heading</LeftSelect>
                    <LeftSelect selectHover onClick={() => addContent({id: 2, content: {question: "", choices: [""], checked: 0}})}> Multiple Choice</LeftSelect>
                    <LeftSelect selectHover onClick={() => addContent({id: 3, content: ""})}>Youtube Link</LeftSelect>
                    <LeftSelect selectHover onClick={() => addContent({id: 4, content: ""})}>Picture</LeftSelect>
                    <LeftSelect selectHover onClick={() => addContent({id: 5, content: ""})}>Free Response</LeftSelect>
                </>}
            </div>

            <div className="absolute dropArea w-[calc(100%-200px)] h-[calc(100%-40px)] top-[40px] right-0" style={interFont.style}>
                    {/* Main content area*/}
                <div className="absolute m-[20px] w-[calc(100%-40px)] h-[calc(100%-100px)] border-2 border-green-300 rounded-[15px] shadow-around-s overflow-y-auto overflow-x-hidden p-[15px]">
                    {/* Title */}
                    <Editable 
                        disableClose 
                        content = {content}
                        setContent = {setContent}
                        className="text-[26px] font-bold mb-[5px]" 
                        onChange={(text:string) => setContentHelper(0, "content", text)} 
                        placeholder="Enter title here" 
                        translatedContent={msg == "Submit" ? content[0].content : undefined} 
                        initialContent={editContent == undefined ? undefined : editContent[0]}
                    />


                    {content.map((value:any, index:number) => {
                        if (value.id == 0) {
                            return <Editable 
                                content = {content}
                                setContent={setContent}
                                className="mb-[5px]" 
                                onChange={(text:string) => setContentHelper(index, "content", text)} 
                                placeholder="Enter description here" 
                                onClose={() => deleteContent(index)}
                                disableClose={index < 2 || msg == "Submit" ? true : false}
                                key={value['vid']}
                                index={index}
                                translatedContent={msg == "Submit" ? value.content : undefined}
                                initialContent={editContent == undefined ? undefined : editContent[index]}
                            />
                        } 
                        else if (value.id == 1)
                            return <Editable
                                content = {content}
                                setContent = {setContent} 
                                className="mb-[5px] font-medium text-[18px]" 
                                onChange={(text:string) => setContentHelper(index, "content", text)}
                                placeholder="Enter subheading here"
                                onClose={() => deleteContent(index)}
                                disableClose={index < 2 || msg == "Submit" ? true : false}
                                key={value['vid']}
                                index = {index}
                                translatedContent={msg == "Submit" ? value.content : undefined}
                                initialContent={editContent == undefined ? undefined : editContent[index]}
                            />
                        else if (value.id == 2) 
                            return <Question 
                                content = {content}
                                setContent = {(e:any[])=>setContent(e)}
                                createAnswerChoice={() => addChoice(index)}
                                setQuestion={(str:string) => setQuestion(index, str)}
                                setChoices={(qInd:number, c:string) => setChoices(index, qInd, c)}
                                setChecked={(qInd:number) => setQuestionChecked(index, qInd)}
                                onClose={() => deleteContent(index)}
                                key={value['vid']}
                                index={index}
                                translatedContent={msg == "Submit" ? value.content : undefined}
                                initialContent={editContent == undefined ? undefined : editContent[index]}
                            />
                        else if (value.id == 3) 
                            return <YoutubeEmbed
                                content = {content}
                                setContent = {(e:any[])=>setContent(e)}
                                onSubmit={(text:string) => setContentHelper(index, "content", text)}
                                onClose={() => deleteContent(index)}
                                key={value['vid']}
                                index={index}
                                initialContent={editContent == undefined ? undefined : editContent[index]}
                            />
                        else if (value.id == 4)
                            return <ImageEmbed 
                                index={index}
                                content = {content}
                                setContent = {(e:any[])=>setContent(e)}
                                onClose={() => deleteContent(index)}
                                setImg={(img:File) => setContentHelper(index, "content", img)}
                                key={value['vid']}
                                initialContent={editContent == undefined ? undefined : editContent[index]}
                            />
                        else if (value.id == 5) {
                            return <div className="w-full h-[70px] border-2 border-slate-200 rounded-[15px] px-[10px] py-[5px] mb-[10px]" >
                                <p className="text-[14px]">Free Response Question</p>
                                <Editable
                                    top={5}
                                    content = {content}
                                    setContent = {(e:any[])=>setContent(e)} 
                                    className="mt-[5px] text-[12px]" 
                                    onChange={(text:string) => setContentHelper(index, "content", text)}
                                    placeholder="Enter question here"
                                    onClose={() => deleteContent(index)}
                                    disableClose={index < 2 || msg == "Submit" ? true : false}
                                    key={value['vid']}
                                    index={index}
                                    translatedContent={msg == "Submit" ? value.content : undefined}
                                    initialContent={editContent == undefined ? undefined : editContent[index]}
                                />
                            </div>

                        }
                    })} 

                </div>
                <button 
                    className="absolute px-[15px] h-[30px] left-[50%] translate-x-[-50%] bottom-[25px] text-[12px] rounded-[15px] bg-blue-500 text-white transition-all duration-300 hover:shadow-around" 
                    onClick={() => {
                        if (msg == "Submit") submit()
                        else translate()
                    }}
                >
                    {msg}
                </button>

                {/* Error message */}
                {error !== "" && 
                    <div className="absolute left-[50%] translate-x-[-50%] w-[430px] bottom-[25px] h-[30px] bg-red-500 shadow-around-xl  rounded-[30px]">
                        <p className="text-white relative left-[0px] top-[50%] translate-y-[-50%] w-full text-center text-[14px]">{error}</p>
                        <IoClose className="absolute top-[50%] translate-y-[-50%] right-[8px] h-[20px] w-[20px] cursor-pointer" color="white" onClick={() => setError("")} />
                    </div>
                }
            </div>
        </Modal>

    )
}