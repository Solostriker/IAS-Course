import Image from "next/image"
import React from "react"
import { interFont } from ".."
import Link from "next/link"
import { auth } from "../../../firebase"
import { UserCredential, signInWithEmailAndPassword} from "firebase/auth"
import { useRouter } from "next/router"
import { getUser, userAtom } from "../api/data"
import { useAtom } from "jotai/react"

export default function logInPage () {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [errorMsg, setErrorMsg] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [user, setUser] = useAtom(userAtom)
    const router = useRouter()    

    async function signIn () {
        setErrorMsg("")
        if (username == "") {
            // set error message somewhere
            setErrorMsg("Username must be filled!")
            return
        }
        else if (password == "") {
            // set error message somewhere 
            setErrorMsg("Password must be filled!")
            return
        } 
        
        setIsLoading(true)    

        await signInWithEmailAndPassword(auth, username+"@gmail.com", password)
            .then(async (value:UserCredential) => {
                const uuid = value.user.uid 
                // we should retrieve information from firebase database yayyy!
                const data = await getUser(username)
                setUser(data)

                setIsLoading(false)
                router.replace("/dashboard")
            })
            .catch((error:any) => {
                setIsLoading(false)

                switch (error.code) {
                    case "auth/invalid-email":
                        setErrorMsg("Invalid user") 
                        break;
                
                    case "auth/user-not-found":
                        setErrorMsg("User not found. Make sure you register first before signing in!")
                        break;

                    case "auth/wrong-password":
                        setErrorMsg("Incorrect password")
                        break;
                }
            }) 
    }

    return (
        <div style={interFont.style} className="w-full h-full bg-emerald-200 absolute">
            <Image src="/ljlLogo.png" width={100} height={100} alt="Loading" className='absolute left-[50%] translate-x-[-50%] top-[13px]' />

            <div className="w-[400px] h-[275px] bg-white absolute left-[50%] top-[100px] translate-x-[-50%] rounded-[30px]">
                <Link href="/" className="absolute bg-slate-200 hover:bg-slate-300 transition-all rounded-full h-[30px] w-[60px] left-[15px] top-[20px] text-[10px] text-center pt-[7px] z-10 duration-500">Go back</Link>

                <p className="text-[20px] relative w-full text-center top-[20px]">Log in</p> 

                <p className="text-[12px] relative w-[300px] left-[50px] top-[20px] mt-[25px]">Enter your username:</p> 
                <input 
                    onInput={(event:any) => {setUsername(event.target.value as string)}} 
                    className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[5px] outline outline-1 outline-gray-300 rounded-[5px]" placeholder="Type here" 
                />


                <p className="text-[12px] relative w-[300px] left-[50px] top-[20px]">Enter your password:</p> 
                <input 
                    onInput={(event:any) => {setPassword(event.target.value as string)}}
                    type="password" 
                    className="text-xs relative left-[50%] translate-x-[-50%] mt-[25px] w-[300px] p-[5px] outline outline-1 outline-gray-300 rounded-[5px]" 
                    placeholder="Type here"  
                />
                <br />

                <p className="relative left-[50px] text-[10px] text-red-600 top-[5px] ">{errorMsg}</p>

                <button className="text-[12px] relative top-[25px] bg-blue-500 text-white w-[80px] h-[25px] rounded-[10px] left-[50%] translate-x-[-50%] hover:w-[100px] hover:h-[30px] hover:rounded-[30px] transition-all" onClick={signIn}>Sign in</button>
            </div> 

        </div>
    )
}