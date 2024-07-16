import { useAtom } from "jotai"
import React, { useEffect } from "react"
import { getImage, getUsersInOrganization, modulesAtom, selectedAssignmentAtom, userAtom } from "./api/data"
import { IoCheckmarkCircleOutline, IoEllipseOutline, IoCloseCircleOutline} from "react-icons/io5"
import { interFont } from "."
import { useRouter } from "next/router"
import NextImage from "next/image"

function UserDisplay (props:any) {
    const user:UserInformation = props.user
    const [isHover, setIsOnHover] = React.useState(false)
    
    return (
        <div 
            onMouseEnter={() => {if (user.didEnterAssignment) setIsOnHover(true)}} 
            onMouseLeave={() => setIsOnHover(false)} 
            onClick={() => {if (user.didEnterAssignment) props.setUserSelection(props.ind)}}
            className={`h-[50px] mx-[20px] my-[15px] rounded-full transition-all duration-300 border-[2px] ${user.didEnterAssignment ? "cursor-pointer" : ""} ${props.isSelected ? "border-green-500" : (isHover ? "border-green-400" : "")}  grid grid-cols-7`} >

            <div className={`left-[10px] text-[14px] col-span-2 border-r-2 transition-all duration-300 ${props.isSelected ? "border-green-500" : ( isHover ? "border-green-400" : "")} `}>
                <p className="relative text-center px-[10px] top-[50%] translate-y-[-50%] truncate">{user.username}</p>
            </div> 
            {user.didEnterAssignment ? <>
                {(user.isQuiz) ? <>
                    <div className="relative ml-[30px] top-[50%] -translate-y-[50%] h-[10px] bg-slate-200 col-span-4 rounded-full">
                        <div className={`relative transition-all duration-500 left-0 top-0 bg-blue-300 h-full rounded-full`} style={{width: user.percentage.toString() + "%"}} />
                    </div>
                    <div className="relative text-center col-span-1">
                        <div className="relative top-[50%] -translate-y-[50%]">
                            {user.percentage}%
                        </div>
                    </div>
                </> : <>
                    <div className="col-span-5">
                        <p className="relative text-center top-[50%] -translate-y-[50%] text-green-600">Completed</p>
                    </div>   
                </>}
            </> : <>
                <div className="col-span-5">
                    <p className="relative text-center top-[50%] -translate-y-[50%] text-red-500 text-[14px]">Did not complete assignment</p>
                </div>
            </>}
        </div>
    )     
}

function DisplayContent (props:any) {
    const [color, ] = React.useState("white")
    const element = props.element
    const id = element.id
    const content = element.content
    const [imgDims, setImgsDims] = React.useState({height: 0, width: 0})

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
        return (<div className={`relative left-[15px] w-[calc(100%-30px)] rounded-[15px] border-2 border-slate-200 my-[15px] bg-${color}`}>
            <p className="relative w-full px-[15px] mt-[15px]">{content.question}</p> 

            {/* {content} */}
            <div className="relative w-full h-[3px]" />
            {content.choices.map((element:any, index:number) => { 
                if (element === "") return <></>
                return (<div key={index} className="relative mt-[5px]">
                    {index === content.checked ? <>
                        <IoCheckmarkCircleOutline color="green" className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                    </> : <>
                        {props.selected === index ? 
                            <IoCloseCircleOutline color="red" className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                        : 
                            <IoEllipseOutline className="cursor-pointer absolute left-[15px] w-[18px] h-[18px]" />
                        }
                    </>}
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
        image.src = `${content}`
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
        console.log(content)
        return <div className="flex mx-[15px] border-[2px] border-slate-300 rounded-[15px]">
            <p className="relative mt-[5px] px-[15px] w-full">{content}</p>
            <p className="" />
        </div>
    }
    else return <></>
}

interface UserInformation {
    username: string,
    percentage: number
    answerUser: number[],
    didEnterAssignment: boolean,
    isQuiz: boolean
}

export default function ViewAssignmentTeacher () {
    const [selectedAssi, ] = useAtom(selectedAssignmentAtom)
    const [userInformation, setUserInformation] = React.useState<UserInformation[]>([])
    const [userSelected, setUserSelection] = React.useState(-1)
    
    const [user, ] = useAtom(userAtom) // array of dictionary  
    const [modules, ] = useAtom(modulesAtom)
    const router = useRouter()
    const [content, setContent] = React.useState([] as any[])

    const [lang, setLang] = React.useState("")

    async function getInfo (isTranslated:boolean = false) {
        if (Object.keys(selectedAssi).length > 0) {
            var contentAssi 
            if (!isTranslated) contentAssi = JSON.parse(selectedAssi.content)
            else contentAssi = JSON.parse(selectedAssi.translatedContent)

            for (var i = 0; i < contentAssi.length; i++) {
                if (contentAssi[i].id === 4) contentAssi[i].content = await getImage(contentAssi[i].content)
            }

            setContent(contentAssi.slice())
        }
    }

    useEffect(() => {
        getInfo()
    }, [selectedAssi])
    
    function returnSelected (ind:number) {
        if (userInformation.length > 0 && userSelected > -1) {
            return userInformation[userSelected].answerUser[ind]
        }
    }

    async function switchLang () {
        await getInfo(lang != "English")
        if (lang == "English") setLang(user.language.split("|")[0])
        else setLang("English")
    }
    
    // fill in user information
    async function GetUserInfo () {
        var userInfo : UserInformation[] = []

        var users = await getUsersInOrganization(user.docOrganizationId) as any 
        var justUsername = users.map((x:any) => x.userId) 
        var justUsernameAssignment = selectedAssi.usersCompleted.map((x:string) => x.split(";")[0])

        // cross reference to selected assi users
        for (var i = 0; i < justUsername.length; i++) {
            if (users[i].isOrganization) continue

            const username = justUsername[i]
            const ind = justUsernameAssignment.indexOf(username)
            
            if (ind > -1) { // is in assignment
                const status = JSON.parse(selectedAssi.usersCompleted[ind].split(";")[1])
                // find percentage now
                var correct = 0
                var totalQ = 0
                var answerUser:number[] = [];
                for (var x = 0; x < content.length; x++) {
                    if (content[x].id === 2) { // is quiz
                        totalQ += 1
                        if (status[x] === "Correct") {
                            correct++
                            answerUser.push(-1) 
                        }
                        else {
                            const wrongAnswer = Number.parseInt(status[x].split("|")[1])
                            answerUser.push(wrongAnswer) 
                        }
                    } else {
                        answerUser.push(-2)
                    }
                }

                const isQuiz = (totalQ > 0)

                userInfo.push({
                    username: users[i].username,
                    percentage: isQuiz ? Math.round((correct/totalQ)*100) : 0, 
                    answerUser: answerUser,
                    didEnterAssignment: true,
                    isQuiz: isQuiz
                })
            } else {
                userInfo.push({
                    username: users[i].username,
                    percentage: 0, 
                    answerUser: [],
                    didEnterAssignment: false,
                    isQuiz: false
                })
            }
        }

        setUserInformation(userInfo)
    }
    
    useEffect(() => {GetUserInfo().then(() => setLang(user.language.split("|")[0]))}, [user, content])
    
    
    
    return (<div style={interFont.style} >
        {Object.keys(content).length > 0 && <>
            <h1 className="relative w-full px-[15px] top-[30px] text-[28px] font-bold">{content[0].content}</h1>            
            <h1 className="relative w-full px-[15px] top-[30px] text-[16px]">{content[1].content}</h1>            
            <p className="absolute right-[15px] top-[25px] text-slate-600 text-right">By {user.organizationName} <br /> {modules[selectedAssi.moduleId]?.title}</p>
            <p className="absolute right-[15px] top-[75px] text-slate-600 text-[12px] text-right">{modules[selectedAssi.moduleId].description} </p>
            
            <button 
                className="relative px-[15px] left-[15px] top-[35px] py-[5px] text-[14px] border-slate-300 border-2 rounded-[15px] transition-all duration-300 hover:bg-slate-300"
                onClick={switchLang}
            >
                <NextImage src="/SwitchIcon.png" alt="Hello" width={25} height={30}/>
            </button>
            
            <br /> <br /> <br />
            <div className="relative w-full flex flex-row">
                <div className="relative w-[60%]">
                    {content.map((element:any, index:number) => {
                        return (<DisplayContent 
                            key={index} 
                            element={element} 
                            ind={index} 
                            selected={returnSelected(index)}
                        />)
                    })}
                </div> 
                <div className="relative mt-[70px] w-[40%] grid col-span-2">
                    <div className="relative mx-[30px] h-[330px] rounded-[15px] shadow-around overflow-y-auto ">
                        <h1 className="relative w-full pb-[10px] px-[15px] top-[15px] text-[20px] font-bold">Students:</h1>            
                        <button onClick={GetUserInfo} className="absolute top-[15px] right-[15px] text-[12px] bg-slate-100 rounded-[15px] transition duration-300 w-[100px] py-[5px]">
                            <p>Refresh</p>
                        </button>
                        {userInformation.length === 0 ? <>
                            <p className="relative w-full text-center my-[30px]">Loading Users...</p>
                        </> : <>{userInformation.map((element:any, ind:number) =>
                            <UserDisplay 
                                user={element} 
                                isSelected={ind === userSelected} 
                                setUserSelection={setUserSelection}
                                ind={ind}
                                key={ind} 
                            />
                        )}</>}
                    </div> 
                </div>
            </div>

            <button onClick={() => router.back()} className="relative mb-[20px] text-[14px] mt-[25px] border-2 border-blue-500 text-blue-500 py-[5px] px-[10px] rounded-[10px] left-[50%] translate-x-[-50%] transition-all duration-300 hover:bg-blue-500 hover:text-white  hover:shadow-around-xl">Done</button>
        </>} 
    </div>)
}