import React, { useEffect } from "react"
import { useAtom } from "jotai"
import { addUserCompletedToAssign, selectedAssignmentAtom, userAtom } from "./api/data"
import { interFont } from "."
import { useRouter } from "next/router"

export default function TakeQuiz () {
    const [selectedAssi, setSelectedAssi]  = useAtom(selectedAssignmentAtom)
    const [user, ] = useAtom(userAtom)
    const [qLength, setQLength] = React.useState(0)
    const [userAns, setUserAns] = React.useState([])
    const [colors, setColors] = React.useState([] as any)
    const [initialScore, setInitialScore] = React.useState(-1)
    const [isAllowedDone, setIsAllowedDone] = React.useState(false)
    const router = useRouter()

    function setAnswer (ind:number, val:any) {
        var copy:any = userAns
        if (ind > copy.length) {
            for (var i = 0; i < copy.length - ind + 1; i++) copy.push("-1")
        }
        
        copy[ind] = val.toString()
        setUserAns(copy.slice())
    } 

    useEffect(() => {
        if (Object.keys(selectedAssi).length > 0) {
            const l = selectedAssi.content.length/6
            if (colors.length == 0) {
                var copy = [] as string[]
                for (var i = 0; i < l; i++) copy.push("#fffff")
                setColors(copy.slice() as any)
            }
            setQLength(l)
        }
    }, [selectedAssi])

    async function submit () {
        if (isAllowedDone) { 
            const userId = user.userId
            const organizationId = user.docOrganizationId
            const dateAssignment = selectedAssi.date
            
            await addUserCompletedToAssign(organizationId, dateAssignment, userId, initialScore.toString())
            setSelectedAssi([] as any)
            router.back()
            return
        }


        var answers = [] as string[]

        for (var i = 0; i < qLength; i++) {
            answers.push(selectedAssi.content[i*6+1])
        }

        // check if answers are equal
        var colorsCopy = colors
        var incorrect = 0
        for (var i = 0; i < qLength; i++)  {
            if (answers[i] !== userAns[i]) {
                colorsCopy[i] = "#fecaca"
                incorrect += 1
            } else {
                colorsCopy[i] = "#bbf7d0"
            }
        }
        setColors(colorsCopy.slice())

        // set initial score
        if (initialScore == -1)
            setInitialScore((qLength - incorrect) / qLength)

        if (incorrect == 0 && isAllowedDone == false) setIsAllowedDone(true)
    }
    
    return (
        <div style={interFont.style}>
            <h1 className="position font-bold absolute top-[15px] w-full text-center text-[25px]">{selectedAssi.title}</h1>
 
            <br /> <br /> <br />

            {[...Array(qLength)].map((value:any, index:number) => {
                if (Object.keys(selectedAssi).length > 0 && selectedAssi.content.length > 0) {
                return (<div key={index} className="m-5 rounded-[15px] shadow-around-l" style={{backgroundColor: `${colors[index]}`}}>
                    <h1 className="relative relative top-[15px] left-[25px] text-[20px]">Question #{index+1}: {selectedAssi.content[index*6]} </h1>

                    <div className="relative relative mt-[25px] mb-[10px] left-[25px]">

                        <input className="w-[20px] h-[20px]" type="radio" name={`group${index}`} value={'0'} onClick={(event:any) => setAnswer(index, event.target.value)} />
                        <label className="text-[17px] relative bottom-[5px] left-[5px] mr-[20px]">{selectedAssi.content[index*6+2]}</label> <br />

                        <input className="w-[20px] h-[20px] mt-[5px]" type="radio" name={`group${index}`} value={'1'} onClick={(event:any) => setAnswer(index, event.target.value)} />
                        <label className="text-[17px] relative bottom-[5px] left-[5px] mr-[20px]">{selectedAssi.content[index*6+3]}</label> <br />

                        <input className="w-[20px] h-[20px] mt-[5px]" type="radio" name={`group${index}`} value={'2'} onClick={(event:any) => setAnswer(index, event.target.value)} />
                        <label className="text-[17px] relative bottom-[5px] left-[5px] mr-[20px]">{selectedAssi.content[index*6+4]}</label> <br />

                        <input className="w-[20px] h-[20px] mt-[5px]" type="radio" name={`group${index}`} value={'3'} onClick={(event:any) => setAnswer(index, event.target.value)} />
                        <label className="text-[17px] relative bottom-[5px] left-[5px] mr-[20px]">{selectedAssi.content[index*6+5]}</label> <br />
                        <div className="relative w-full h-[20px]" />
                    </div>                    
                </div>)
                } else return (<></>)
            })}

            <button className="relative left-[50%] mt-[10px] mb-[20px] translate-x-[-50%] text-[14px] p-[5px] px-[12px] border-2 border-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white rounded-[15px]" onClick={submit}>{isAllowedDone ? <>I'm Done!</> : <>Submit Quiz</>}</button>
            
        </div>
    )    
}