"use client";
import Link from "next/link";
import React,{useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user,setUser] = React.useState({
        email:"",
        password:"",
    })

    const [buttonDisabled,setButtonDisabled] = React.useState(false);
    const [loading,setLoading] = React.useState(false);

    const onLogin = async()=>{
        try{
            setLoading(true);
            const response = await axios.post('/api/users/login',user);
            console.log("Login successful",response.data);
            toast.success("Login successful");
            router.push('/profile');
        }
        catch(error:unknown){
            if (error instanceof Error) {
                console.log("Login failed", error.message);
                toast.error(error.message);
            } else {
                console.log("Login failed", error);
                toast.error("An unknown error occurred");
            }
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user.email.length>0 && user.password.length>0){
            setButtonDisabled(false);
        }
        else{
            setButtonDisabled(true);
        }
    },[user])
    return(   
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Toaster position="top-center" reverseOrder={false} />
        <h1>{loading?"Loading...":"Login"} </h1>
        <hr/>
        <label htmlFor="email">Email:</label>
        <input className="p-2 border border-gray-50 rounded-lg mb-4 focus:outline-none focus:border-gray-600" 
            id="email"
            type="text"
            value={user.email}
            onChange={(e)=>setUser({...user,
            email:e.target.value})}
            placeholder="email"
        />
        <label htmlFor="password">Password:</label>
        <input className="p-2 border border-gray-50 rounded-lg mb-4 focus:outline-none focus:border-gray-600" 
            id="password"
            type="text"
            value={user.password}
            onChange={(e)=>setUser({...user,
            password:e.target.value})}
            placeholder="password"
        />

        <button 
        onClick={onLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
            Login
        </button>
        <Link href="/signup" className="mt-4 text-blue-500 hover:underline">Visit Signup Page</Link>
    </div>
)
}