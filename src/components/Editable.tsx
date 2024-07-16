import React, { ChangeEvent, useEffect, useRef } from "react"
import { IoClose, IoCheckmarkCircleOutline, IoEllipseOutline } from "react-icons/io5"
import { interFont } from "@/pages"

import NextImage from "next/image"
import { getImage } from "@/pages/api/data"

//Test edge cases for drag and drop
//-Editable
//  -Question (y)
//  -YoutubeEmbed (y)
//  -ImageEmbed (y)
//-Question
//  -multiple choices (N)
    // -The content of when the user types into the multiple choices, the array of the answerChoices are all empty strings, therefore there is currently no method of dragging and dropping the multiple choices as they do not have their own unique identifier in the array.
//  -Editable (y)
//  -YoutubeEmbed (y)
//  -ImageEmbed (y)
//-YoutubeEmbed
//  -Editable (y)
//  -Question (y)
//  -ImageEmbed (y)
//  -Youtube Link submitted (N) 
    // -When dragging and dropping the Youtube Input after a Youtube Link is added to the modal, the preview of the Youtube video disapears. However, when dragging and dropping the default input and submit for a Youtube link, upon submitting the translated assignment, the changed design for the assignment remains the same.
//-ImageEmbed
//  -Editable (y)
//  -Question (y)
//  -YoutubeImbed (y)
// -Image Link submitted (N)
    // -When dragging and dropping the Image Input after an image is added to the modal, the preview of the image disapears. However, when dragging and dropping the default input and submit for an image file, upon submitting the translated assignment, the changed design for the assignment remains the same.


export default function Editable (props:any) {
    const [hover, setHover] = React.useState(false)
    const [noValue, setNoValue] = React.useState(true)
    const pRef = React.useRef<HTMLParagraphElement>(null)
    const [didCopyContent, setDC] = React.useState(false)
    const [didSetInitial, setI] = React.useState(false)
    const [isOver, setIsOver] = React.useState(false)

    const currentIndex = useRef();

    function disAllowEnter (event:any) { 
        if (event.keyCode == 8) return // backspace
        if (isOver || event.keyCode == 13) event.preventDefault()
    }

    function onInput (event:any) {
        const text = event.currentTarget.textContent
        props.onChange(text)
        if (text === "") setNoValue(true) 
        else setNoValue(false)
        if (text.length >= 150) {
            pRef.current!.innerText = text.substring(0, text.length)
            setIsOver(true)
        } else {
            setIsOver(false)
        }
    }

    useEffect(() => {
        if (props.translatedContent != undefined) {
            if (!didCopyContent) {
                pRef.current!.innerText = props.translatedContent 
                setDC(true)
            }
        }
    }, [props.translatedContent])

    useEffect(() => {
        if (!didSetInitial && props.initialContent != undefined && props.initialContent.content.length > 0) {
            setNoValue(false)
            pRef.current!.innerText = props.initialContent.content
            setI(true)
        }
    }, [props.initialContent])

    function handleOnDrop(e:any, newIndex:any) {
        if(newIndex !== 1 && newIndex !== 0 && newIndex){
            if(newIndex !== 1 && newIndex !== 0 && newIndex){
                e.preventDefault();
                const draggedIndex = parseInt(e.dataTransfer.getData("text"));
                const content = props.content.map((ele:any)=>ele);
                const [draggedComponent] = content.splice(draggedIndex, 1);
                content.splice(newIndex, 0, draggedComponent);
                props.setContent(content);
            }
        }
      }

    return (
        <div 
            draggable = {true} 
            onDrop={(e) => handleOnDrop(e, props.index)} 
            onDragOver={(e) => e.preventDefault()} 
            onDragStart={(e) => e.dataTransfer.setData("text", props.index.toString())} 
            style={interFont.style} 
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
            className={"relative min-h-[30px] w-[100%] " + props.className}>
            {noValue && 
                <p 
                    className="absolute text-slate-400 select-none"
                    style={{top: props.top == undefined ? 0 : props.top}} 
                >{props.placeholder}</p>
            }
            <p 
                ref={pRef} 
                className={"relative outline-none w-[calc(100%-30px)] " + props.classNameText} 
                style={{top: props.top == undefined ? 0 : props.top}} 
                onInput={onInput} 
                onKeyDown={(event:any) => disAllowEnter(event)} 
                contentEditable 
            />

            {hover && (props.disableClose == undefined || props.disableClose === false) && <IoClose onClick={() => props.onClose()} className="cursor-pointer w-[20px] h-[20px] absolute top-[50%] translate-y-[-50%] right-[0px]" />}
        </div>
    )
}  

export function Choice (props:any) {
    const [hover, setHover] = React.useState(false)
    const [noValue, setNoValue] = React.useState(true)
    const pRef = React.useRef<HTMLParagraphElement>(null)
    const [didCopyContent, setDC] = React.useState(false)
    const [didSetInitial, setI] = React.useState(false)
    const [isOver, setIsOver] = React.useState(false)

    const currentIndex = useRef();

    function disAllowEnter (event:any) { 
        if (event.keyCode == 8) return // backspace
        if (isOver || event.keyCode == 13) event.preventDefault()
    }

    function onInput (event:any) {
        const text = event.currentTarget.textContent
        props.onChange(text)
        if (text === "") setNoValue(true) 
        else setNoValue(false)
        if (text.length >= 150) {
            pRef.current!.innerText = text.substring(0, text.length)
            setIsOver(true)
        } else {
            setIsOver(false)
        }
    }

    useEffect(() => {
        if (props.translatedContent != undefined) {
            if (!didCopyContent) {
                pRef.current!.innerText = props.translatedContent 
                setDC(true)
            }
        }
    }, [props.translatedContent])

    useEffect(() => {
        if (!didSetInitial && props.initialContent != undefined && props.initialContent.content.length > 0) {
            setNoValue(false)
            pRef.current!.innerText = props.initialContent.content
            setI(true)
        }
    }, [props.initialContent])


    function handleOnDrop(e:any, newIndex:any) {
        const draggedIndex = parseInt(e.dataTransfer.getData("choice"));
        if(draggedIndex<0 || draggedIndex >= 0){
        const data = props.content.map((ele:any)=>ele);
        let content = data.filter((ele:any)=>ele.content.choices)[0]
        const contentChoices = content.content.choices.map((ele:any)=>ele)
        const [draggedComponent] = contentChoices.splice(draggedIndex, 1);
        contentChoices.splice(newIndex, 0, draggedComponent);
        data[props.index].content.choices = contentChoices;
        props.setContent(data);
        }
      }

    return (
        <div 
            draggable = {true} 
            onDrop={(e) => handleOnDrop(e, props.index)} 
            onDragOver={(e) => e.preventDefault()} 
            onDragStart={(e) => e.dataTransfer.setData("choice", props.index.toString())} 
            style={interFont.style} 
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
            className={"relative min-h-[30px] w-[100%] " + props.className}>
            {noValue && 
                <p 
                    className="absolute text-slate-400 select-none"
                    style={{top: props.top == undefined ? 0 : props.top}} 
                >{props.placeholder}</p>
            }
            <p 
                ref={pRef} 
                className={"relative outline-none w-[calc(100%-30px)] " + props.classNameText} 
                style={{top: props.top == undefined ? 0 : props.top}} 
                onInput={onInput} 
                onKeyDown={(event:any) => disAllowEnter(event)} 
                contentEditable 
            />

            {hover && (props.disableClose == undefined || props.disableClose === false) && <IoClose onClick={() => props.onClose()} className="cursor-pointer w-[20px] h-[20px] absolute top-[50%] translate-y-[-50%] right-[0px]" />}
        </div>
    )
}  



export function LeftSelect (props:any) {
    return (
        <div 
            className={`border-2 border-orange-400 w-[70%] relative cursor-pointer left-[50%] translate-x-[-50%] h-[30px] rounded-[15px] mt-[10px] transition-all duration-300 ${props.selected ? "bg-orange-400 shadow-around-l" : ""} ${props.selectHover ? "hover:bg-orange-400 hover:shadow-around-l hover:text-white" : ""} `} 
            onClick={props.onClick}
        >
            <p className=
                {`w-full p-[5px] inline-block align-text-middle text-center text-[12px] transition-all duration-300 ${props.selected ? "text-white" : "text-black"} ${props.selectHover ? "hover:text-white" : ""}`
            }>{props.children}</p>

        </div>
    ) 
}



export function Question (props:any) {
    const [answerChoices, setAnswerChoices] = React.useState([""])
    const [checked, setChecked] = React.useState(0)
    const [didSetInitial, setI] = React.useState(false)

    function setcheckedC (index:number) {
        setChecked(index)
        props.setChecked(index)
    }

    function addAnswerChoice () {
        props.createAnswerChoice()
        setAnswerChoices([...answerChoices, ""])
    }

    useEffect(() => {
        if (!didSetInitial && props.initialContent != undefined) {
            setChecked(props.initialContent.content.checked) 
            setAnswerChoices(props.initialContent.content.choices)
            setI(true)
        }
    }, [props.initialContent])

    function handleOnDrop(e:any, newIndex:any) {
        if(newIndex !== 1 && newIndex !== 0 && newIndex){
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("text"));
        const content = props.content.map((ele:any)=>ele);
        const [draggedComponent] = content.splice(draggedIndex, 1);
        content.splice(newIndex, 0, draggedComponent);
        props.setContent(content);
        }
      }



    //   ['test1', 'test2', 'test3', 'test4']
    // draggedIndex = 2

      function handleOnMutipleChoiceDrop(e:any, newIndex:any) {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("choice"));
        if(draggedIndex<0 || draggedIndex >= 0){
        const data = props.content.map((ele:any)=>ele);
        let content = data.filter((ele:any)=>ele.content.choices)[0]
        const contentChoices = content.content.choices.map((ele:any)=>ele)
        const [draggedComponent] = contentChoices.splice(draggedIndex, 1);
        contentChoices.splice(newIndex, 0, draggedComponent);
        data[props.index].content.choices = contentChoices;
        props.setContent(data);
        }
      }

      let i = 0

      return (
        <div className="relative w-[100%] rounded-[15px] border-2 border-slate-200 mb-[15px]"
        draggable = {true} 
        onDrop={(e) => handleOnDrop(e, props.index)} 
        onDragOver={(e) => e.preventDefault()}
        onDragStart={(e) => e.dataTransfer.setData("text", props.index.toString())}
        >
            <Choice 
                index = {0}
                translatedContent={props.translatedContent == undefined ? undefined : props.translatedContent.question} 
                className="left-[15px] top-[15px]" placeholder="Enter question here" 
                disableClose 
                onChange={(text:string) => props.setQuestion(text)}  
                initialContent={props.initialContent == undefined ? undefined : {content: props.initialContent.content.question}}
            />
            <IoClose onClick={() => props.onClose()} className="cursor-pointer w-[20px] h-[20px] absolute top-[14px] right-[13px]" />

            <button onClick={addAnswerChoice} className="absolute top-[10px] bg-slate-200 h-[25px] w-[100px] text-[12px] right-[45px] rounded-[10px]">Add Answer</button>

            <br />
            {answerChoices.map((element:any, index:number) => {
                return (<div className="relative" 
                key = {`k-${i++}`}
                draggable = {true} 
                onDrop={(e) =>  handleOnMutipleChoiceDrop(e, index)} 
                onDragOver={(e) => e.preventDefault()}
                onDragStart={(e) => e.dataTransfer.setData("choice", index.toString())}
                >
                    {checked === index ? 
                        <IoCheckmarkCircleOutline onClick={() => setcheckedC(index)} className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                    : 
                        <IoEllipseOutline onClick={() => setcheckedC(index)} className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                    }
                    <Choice
                        content = {props.content}
                        setContent = {(e:any)=>props.setContent(e)}
                        index = {props.index}
                        key = {`e-${i++}`}
                        translatedContent={props.translatedContent == undefined ? undefined : props.translatedContent.choices[index]} 
                        className="absolute left-[40px] text-[12px] top-[50%]" 
                        placeholder="Enter Answer Choice here" disableClose 
                        onChange={(text:string) => props.setChoices(index, text)}  
                        initialContent={props.initialContent == undefined ? undefined : {content: props.initialContent.content.choices[index]}}
                    />
                </div>)
            })}
        </div>
    )
}

export function YoutubeEmbed (props:any) {
    const [link, setLink] = React.useState("")
    const [finalLink, setFinalLink] = React.useState("")
    const [hover, setHover] = React.useState(false)
    const inputRef = React.createRef<HTMLInputElement>()
    const [placeholder, setPlaceholder] = React.useState("Enter Youtube Link Here")
    const [didSetInitial, setDidSetInitial] = React.useState(false)
    const [vidSet, setVidSet] = React.useState(false)

    useEffect(() => {
        if (!didSetInitial && props.initialContent != undefined && !vidSet) {
            setFinalLink(props.initialContent.content)
            setDidSetInitial(true)
        }
    }, [props.initialContent])
    
    function youtube_parser(url:string){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    function done () {
        const l = youtube_parser(link)
        if (l === false) {
            inputRef.current!.value = ""
            setLink("")
            setPlaceholder("Please enter a valid url link")
            return
        }
        
        setFinalLink(l) 
        props.onSubmit(l)
        setVidSet(true)
    }

    function handleOnDrop(e:any, newIndex:any) {
        if(newIndex !== 1 && newIndex !== 0 && newIndex){
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("text"));
        const content = props.content.map((ele:any)=>ele);
        const [draggedComponent] = content.splice(draggedIndex, 1);
        content.splice(newIndex, 0, draggedComponent);
        props.setContent(content);
        }
      }

    if (finalLink === "") {
        return (
            <div draggable = {true} onDrop={(e) => handleOnDrop(e, props.index)} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => e.dataTransfer.setData("text", props.index.toString())} className="relative w-[320px] rounded-[15px] bg-slate-100 h-[40px] mb-[5px]">
                <input ref={inputRef} className="bg-slate-100 outline-none text-[12px] w-[230px] absolute top-[50%] -translate-y-[50%] left-[15px]" onChange={(event:any) => setLink(event.target.value)}></input>
                {link === "" &&
                    <p onClick={() => inputRef.current!.focus()} className="text-slate-400 absolute top-[50%] -translate-y-[50%] left-[15px] text-[12px]">{placeholder}</p>
                }
                <button onClick={done} className="absolute text-[10px] py-[2px] top-[50%] -translate-y-[50%] right-[30px] bg-blue-500 text-white rounded-[15px] w-[40px]">
                    Done
                </button>
                <IoClose onClick={() => props.onClose()} className="w-[18px] h-[18px] absolute top-[50%] -translate-y-[50%] bg-red-400 rounded-full p-[2px] right-[7px] cursor-pointer" color="white" />
            </div>
        )
    } 
    else {
        return <div draggable = {true} onDrop={(e) => handleOnDrop(e, props.index)} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => e.dataTransfer.setData("text", props.index.toString())}  className="w-full h-[315px] mb-[10px] relative  " onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <iframe className="absolute top-0 left-[50%] -translate-x-[50%]" width="560" height="315" src={`https://www.youtube.com/embed/${finalLink}`} />
            
            {hover && 
                <IoClose onClick={() => props.onClose()} className="cursor-pointer w-[20px] h-[20px] absolute top-[50%] translate-y-[-50%] right-[0px]" />
            }
        </div>
    }

}

export function ImageEmbed (props:any) {
    const [img, setImg] = React.useState(null as any)
    const [hover, setHover] = React.useState(false)
    const [height, setHeight] = React.useState(0)
    const [width, setWidth] = React.useState(0)
    const hiddenFileInput = React.useRef<HTMLInputElement>(null)
    const [imgSet, setImgSet] = React.useState(false)

    useEffect(() => {

        async function a () {
            if (props.initialContent != undefined && !imgSet) {
                const url = await getImage(props.initialContent.content)
                var image = new Image()
                image.src = url                    
                image.onload = () => {
                    setHeight(500 * (image.height / image.width))
                    setWidth(500)
                }
            }
        } 
        a()
    }, [props])

    function handleChange (event:ChangeEvent<HTMLInputElement>) {
        if (!imgSet) {
            if (event.target == null) return
            if (event.target.files == null) return

            const url = URL.createObjectURL(event.target.files![0])
            
            var image = new Image()
            image.src = url
                
            image.onload = () => {
                setHeight(500 * (image.height / image.width))
                setWidth(500)
                setImg(url)
                props.setImg(event.target.files![0])
                setImgSet(true)
            }

            image.onerror = (err:any) => {
                console.error(err);
            };
        }
    }

    function handleOnDrop(e:any, newIndex:any) {
        e.preventDefault();
        if (newIndex !== 1 && newIndex !== 0 && newIndex){
            const draggedIndex = parseInt(e.dataTransfer.getData("text"));
            const content = props.content.map((ele:any)=>ele);
            const [draggedComponent] = content.splice(draggedIndex, 1);
            content.splice(newIndex, 0, draggedComponent);
            props.setContent(content);
        }
      }

    if (!imgSet){
        return <div draggable = {true} 
        onDrop={(e) => handleOnDrop(e, props.index)} 
        onDragOver={(e) => e.preventDefault()} 
        onDragStart={(e) => {
            e.dataTransfer.setData("text", props.index.toString())
        }} 
        className="relative w-[150px] rounded-[15px] bg-slate-100 h-[40px] mb-[5px]">
            <IoClose onClick={() => props.onClose()} className="w-[18px] h-[18px] absolute top-[50%] -translate-y-[50%] bg-red-400 rounded-full p-[2px] right-[7px] cursor-pointer" color="white" />
            <button className="absolute bg-blue-500 left-[15px] w-[100px] h-[20px] top-[50%] -translate-y-[50%] rounded-[10px]" onClick={() => hiddenFileInput.current!.click()}>
                <p className="text-[10px] text-white">Upload Image</p>
            </button>
            <input 
                type="file"
                accept="image/*"
                ref={hiddenFileInput}
                style={{display:'none'}} 
                onChange={handleChange}
            /> 
        </div>
    }else 
        return <div draggable = {true} 
            onDrop={(e) => handleOnDrop(e, props.index)} 
            onDragOver={(e) => e.preventDefault()} 
            onDragStart={(e) =>{
                e.dataTransfer.setData("text", props.index.toString())
            }} 
            style={interFont.style} className="w-full mb-[10px] relative  " onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <NextImage className="relative left-[50%] -translate-x-[50%]" width={width} height={height} src={img} alt="Loading image..." />
            {hover && 
                <IoClose onClick={() => props.onClose()} className="cursor-pointer w-[20px] h-[20px] absolute top-[50%] translate-y-[-50%] right-[0px]" />
            }
        </div>
}