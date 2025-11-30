"use client"

import axios from "axios"
import Link from "next/link"
import React, { useState,useEffect} from "react"

export default function VerifyMailPage() {
    const [token, setToken] = useState("")
    const [verified,setVerified]=useState(false)
    const [error,setError]=useState(false)

    const handleVerify = async () => {
        try{    
            console.log("Sending token:", token);
            await axios.post('/api/users/verifymail',{token})
            setVerified(true)
        }catch(error:unknown){
            setError(true)
            console.log(axios.isAxiosError(error) ? error.response?.data : 'Unknown error')
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken ? decodeURIComponent(urlToken) : "")
    },[])

    useEffect(() => {
        if(token.length>0){
            handleVerify();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token])

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl">Verify email </h1>
        <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "No token found"}</h2>

        {verified && 
        <div className="text-green-500">
        Email verified successfully! 
        You can now 
        <Link href="/login"> login</Link>.
        </div>}

        {error && 
        <div className="text-red-500">
        There was an error verifying your email. Please try again.
        </div>}

      </div>
    )
}