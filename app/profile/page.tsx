"use client"
import axios from "axios"
import Link from "next/link"
import React,{useState} from "react"
import {useRouter} from "next/navigation";
import toast, { Toaster } from "react-hot-toast"

export default function ProfilePage() {
    const router = useRouter();
    const [data,setData] = useState("nothing");

    const logout = async()=>{
        try{
            const response = await axios.get('/api/users/logout');
            console.log("Logout successful", response.data);
            toast.success("Logout successful! Redirecting to login...");
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }
        catch(error:unknown){
            console.log(error instanceof Error ? error.message : "An error occurred")
            toast.error("Logout failed. Please try again later.");

        }
    }

    const getUserDetails = async()=>{
        const res = await axios.get('/api/users/me');
        console.log("User details:", res.data);
        setData(res.data.data._id);
    }
    return(   
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Toaster position="top-center" reverseOrder={false} />
        <h1>Profile</h1>
        <hr/>
        <p>Profile page</p>
        <h2 className="mt-4 bg-green-700">{data==='nothing'?"Nothing": <Link href={`/profile/${data}`}>{data}</Link>}
        </h2>
    <hr/>
    <button
    onClick={logout}
    className="bg-red-500 text-white px-2 py-1 rounded-lg mt-2 hover:bg-red-700"
    >Logout</button>

    <button
    onClick={getUserDetails}
    className="bg-green-500 text-white px-2 py-1 rounded-lg mt-2 hover:bg-green-700"
    >Get User Details</button>

    </div>
)
}