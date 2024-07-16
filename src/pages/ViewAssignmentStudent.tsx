import { useAtom } from "jotai"
import React, { useEffect } from "react"
import {addUserCompletedToAssign, getImage, modulesAtom, selectedAssignmentAtom, userAtom } from "./api/data"
import { IoCheckmarkCircleOutline, IoEllipseOutline, IoCloseCircleOutline, IoRadioButtonOn} from "react-icons/io5"
import { interFont } from "."
import { useRouter } from "next/router"
import NextImage from "next/image"
import Editable from "@/components/Editable"

 function DisplayContent (props:any) {
    const [selected, setSelected] = React.useState(-1)
    const [checked, setChecked] = React.useState(false)
    const [isCorrect, setIsCorrect] = React.useState(false)
    const [lastIncorrect, setLastIncorrect] = React.useState(-1)
    const [imgDims, setImgsDims] = React.useState({height: 0, width: 0}) 
    const element = props.element
    const id = element.id
    const content = element.content

    // Button State
    useEffect(() => {
        if (props.buttonState === "Grading") {
            if (id === 2 && selected > -1) {
                setChecked(true)
                const isCorrect = (selected === content.checked)
                setIsCorrect(isCorrect)

                if (!isCorrect) setLastIncorrect(selected)
                else setLastIncorrect(-1)

                var copy = props.status
                copy[props.ind] = (isCorrect ? "Correct" : ("Not Correct|"+selected.toString())) 
                props.setStatus(copy.slice())
            }  
            else if (id === 2 && selected === -1) {
                var copy = props.status
                copy[props.ind] = "Not Answered"
                props.setStatus(copy.slice())
            }
            else {
                var copy = props.status
                copy[props.ind] = "Done"
                props.setStatus(copy.slice())
            }
        }
    }, [props.buttonState, props])

    // we already display title and description
    if (props.ind <= 1) return <></>
    
    if (id === 0) {
        return (
            <p className="relative mt-[5px] px-[15px] w-full">{content}</p>
        )
    }
    else if (id === 1) {
        return (
            <p className="relative mt-[5px] font-medium text-[18px] px-[15px] w-full">{content}</p>
        )
    }
    
    else if (id === 2) {
        return (<div className="relative left-[15px] w-[calc(100%-30px)] rounded-[15px] border-2 border-slate-200 my-[15px]" style={{borderColor: 
            checked ? (isCorrect ? "green" : "red") : ""}} >
            <p className="relative w-full px-[15px] mt-[15px]">{content.question}</p> 

            {/* {content} */}
            <div className="relative w-full h-[3px]" />
            {content.choices.map((element:any, index:number) => { 
                if (element === "") return <></>
                return (<div key={index} className="relative mt-[5px]">
                    {lastIncorrect === index ? <>
                        <IoCloseCircleOutline color="red" className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" /> 
                    </> : <>
                    {isCorrect && selected === index ? <>
                        <IoCheckmarkCircleOutline color="green" className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                    </> : <> 
                    {selected === index ? 
                        <IoRadioButtonOn className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                    : 
                        <IoEllipseOutline onClick={() => {if (!isCorrect) setSelected(index)}} className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                    }
                    </>}</>}
                    <p className="relative left-[40px] text-[12px] top-[50%]" placeholder="Enter Answer Choice here">{element}</p>
                </div>)
            })}
            <div className="relative w-full h-[15px]" />
        </div>)
    } 
    else if (id === 3) {
        return <div className="w-full h-[315px] mb-[10px] relative"> 
            <iframe className="absolute top-0 left-[50%] -translate-x-[50%]" width="560" height="315" src={`https://www.youtube.com/embed/${content}`} />
        </div>
    }
    else if (id === 4) {
        var image = new Image()        
        image.src = content
        image.onload = () => {
            setImgsDims({
                width: 500, 
                height: 500 * (image.height / image.width)
            })
        }
         
        if (imgDims.height > 0 && imgDims.width > 0) return <NextImage 
            width={imgDims.width} 
            height={imgDims.height} 
            src={content} 
            alt="Loading image..." 
            className="relative left-[50%] -translate-x-[50%]"
        /> 
        else return <></>
    }
    else if (id == 5) {
        return <div className="flex flex-col mx-[15px] py-[5px] my-[5px] px-[15px] border-[2px] border-slate-300 rounded-[15px]">
            <p className="relative w-full text-[18px]">{content}</p>
            <input placeholder="Enter Response here" className="outline-none" />
        </div>
    }
    else return <></>
}

export default function ViewAssignmentStudent () {
    const [selectedAssi, ] = useAtom(selectedAssignmentAtom)
    const [content, setContent] = React.useState([] as any)
    const [buttonState, setButtonState] = React.useState("Submit")
    const [user, ] = useAtom(userAtom) // array of dictionary  
    const [modules, ] = useAtom(modulesAtom)
    const [status, setStatus] = React.useState([] as string[])
    const [initialStatus, setInitialScore] = React.useState([] as string[])
    const [lang, setLang] = React.useState("")
    const router = useRouter()

    async function getInfo (isTranslated:boolean = false) {
        if (Object.keys(selectedAssi).length > 0) {
            var contentAssi 
            if (!isTranslated) contentAssi = JSON.parse(selectedAssi.content)
            else contentAssi = JSON.parse(selectedAssi.translatedContent)

            if (lang == "")
                setStatus(Array(contentAssi.length).fill(""))

            // check if there is a quiz
            var canDone = true;

            for (var i = 0; i < contentAssi.length; i++) {
                if (contentAssi[i].id === 2) canDone = false;
                if (contentAssi[i].id === 4) contentAssi[i].content = await getImage(contentAssi[i].content)
            }

            if (canDone) setButtonState("Done")
            setContent(contentAssi.slice())
        }
    }

    useEffect(() => {
        getInfo().then(() => {
            setLang(user.language.split("|")[0])
        })
    }, [selectedAssi])
    
    async function switchLang () {
        await getInfo(lang != "English")
        if (lang == "English") setLang(user.language.split("|")[0])
        else setLang("English")
    }

    async function submit () {
        if (buttonState === "Done") {
            // first add to assignment in firebase
            setButtonState("Setting as completed...")
            
            // add users to complete the assignment
            await addUserCompletedToAssign(user.docOrganizationId, selectedAssi.date, user.userId, JSON.stringify(initialStatus))

            // then go back
            router.back()
            return
        }
        setButtonState("Grading")
    }

    useEffect(() => {
        var didDone = true
        var canDone = true
        for (var i = 0; i < status.length; i++) {
            if (status[i] === "") didDone = false
            if (status[i] === "Not Answered" || status[i].split("|")[0] === "Not Correct") canDone = false
        }

        if (status.length > 0) {
            if (didDone && initialStatus.length === 0) setInitialScore(status.slice())
            if (canDone && didDone) setButtonState("Done")
            else if (didDone) setButtonState("Submit")
        }
    }, [status])
    
    return (<div style={interFont.style} className="overflow-x-hidden">
        {Object.keys(content).length > 0 && <>
            <h1 className="relative w-full px-[15px] top-[30px] text-[28px] font-bold">{content[0].content}</h1>            
            <h1 className="relative w-full px-[15px] top-[30px] text-[16px]">{content[1].content}</h1>            
            <p className="absolute right-[15px] top-[25px] text-slate-600 text-right">By {user.organizationName} <br /> {modules[selectedAssi.moduleId].title}</p>
            <p className="absolute right-[15px] top-[75px] text-slate-600 text-[12px] text-right">{modules[selectedAssi.moduleId].description} </p>
            
            <button 
                className="relative px-[15px] left-[15px] top-[35px] py-[5px] text-[14px] border-slate-300 border-2 rounded-[15px] transition-all duration-300 hover:bg-slate-300"
                onClick={switchLang}
            >
                <NextImage src="/SwitchIcon.png" alt="Hello" width={25} height={30}/>
            </button>
            
            <br /> <br /> <br />
            {content.map((element:any, index:number) => {
                return (<DisplayContent 
                    key={index} 
                    element={element} 
                    ind={index} 
                    setButtonState={setButtonState}
                    buttonState={buttonState}
                    status={status}
                    setStatus={setStatus}
                />)
            })}

            <button onClick={submit} className="relative mb-[20px] text-[14px] mt-[25px] border-2 border-blue-500 text-blue-500 py-[5px] px-[10px] rounded-[10px] left-[50%] translate-x-[-50%] transition-all duration-300 hover:bg-blue-500 hover:text-white  hover:shadow-around-xl">{buttonState}</button>
        </>} 

        <br />


    </div>)
}