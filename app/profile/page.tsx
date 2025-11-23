"use client"
import axios from "axios"
import Link from "next/link"
import {useRouter} from "next/navigation";
import toast, { Toaster } from "react-hot-toast"

export default function ProfilePage() {
    const router = useRouter();

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
    return(   
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Toaster position="top-center" reverseOrder={false} />
        <h1>Profile</h1>
        <hr/>
        <p>Profile page</p>
    <hr/>
    <button
    onClick={logout}
    className="bg-red-500 text-white px-2 py-1 rounded-lg mt-2 hover:bg-red-700"
    >Logout</button>
    </div>
)
}