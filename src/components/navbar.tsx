import Image from 'next/image'
import Link from 'next/link'
import { interFont } from '@/pages'
import { auth } from '../../firebase'
import React, { useEffect } from 'react'
import { IoPersonCircleOutline } from "react-icons/io5"
import { useRouter } from 'next/router'
import { useAtom } from "jotai"
import { assignmentsAtom, userAtom } from '@/pages/api/data'

export default function NavBar (props:any) {
    const [isValidPerson, setIsValidPerson] = React.useState(false)
    const [menuBar, setMenuBar] = React.useState(false)
    const [, setUser] = useAtom(userAtom)
    const [, setAssignments] = useAtom(assignmentsAtom)
    const router = useRouter()
    
    useEffect(() => {
        auth.onAuthStateChanged(async (user:any) => {
            if (user)
                setIsValidPerson(true)
        })
    }) 
    
    function toggleMenuBar () {
        setMenuBar(!menuBar)
    }

    const styleShow = () => {
        if (menuBar) return {
            opacity: 1,
        }
        else return {
            opacity: 0,
        }
    }

    async function signOut () {
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
        setAssignments([] as any)

        router.replace("/")
        setIsValidPerson(false)
        setMenuBar(false)
    }

    return (
        <div style={interFont.style} className='h-16 bg-green-200'>
            <Image src="/ljlLogo.png" width={70} height={70} alt="Loading" className='relative top-2 left-2' />

            <p className='text-xl absolute top-[18px] left-[90px] font-medium'>IAS Learning Hub</p>

            {props.showLogin && <>
                {!isValidPerson ? <>
                    <Link href="/auth/signUpPage" className='absolute right-3 top-4 h-[35px] p-1 px-3 flex font-sans hover:bg-green-300 rounded-[40px] transition-all duration-500'> 
                        <p className='select-none'>Sign up</p>
                    </Link>

                    <Link href="/auth/loginPage" className='absolute right-[100px] top-4 h-[35px] p-1 flex font-sans hover:bg-green-300 rounded-[40px] px-3 transition-all duration-500'> 
                        <p className='select-none'>Log in</p>
                    </Link>
                </> : 
                    <IoPersonCircleOutline onClick={toggleMenuBar} size="40px" className='absolute right-[12px] top-[13px] hover:cursor-pointer' />
                }
            </>}
        
            <div 
                className='transition-all w-[200px] h-[160px] bg-slate-100 rounded-[10px] absolute right-[15px] top-[80px] duration-500 bg-white shadow-inset shadow-around'
                style={styleShow()}
            >
                <button onClick={() => {router.replace("/dashboard")}}className='transition-all duration-300 w-[100%] h-[40px] hover:bg-slate-100 rounded-t-[10px] text-center text-[12px] border-b-[1px]'>Dashboard</button>
                <button className='transition-all duration-300 w-[100%] h-[40px] hover:bg-slate-100 text-center text-[12px] border-b-[1px]'>Settings</button>
                <button className='transition-all duration-300 w-[100%] h-[40px] hover:bg-slate-100 text-center text-[12px] border-b-[1px]'>Give feedback</button>
                <button className='transition-all duration-300 w-[100%] h-[40px] hover:bg-slate-100 rounded-b-[10px] text-center text-[12px]' onClick={signOut}>Sign out</button>
            </div>

        </div>
    )
}
