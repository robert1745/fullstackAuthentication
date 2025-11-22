"use client";
import Link from "next/link";
import React ,{useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user,setUser] = React.useState({
        email:"",
        password:"",
        username:""
    })
    const [buttonDisabled,setButtonDisabled] = React.useState(false);
    const [loading,setLoading] = React.useState(false);

    const onSignup = async()=>{
         try{
            setLoading(true);
            const response = await axios.post('/api/users/signup',user);
            console.log("Signup successful",response.data);
            toast.success("Signup successful! Redirecting to login...");
            setTimeout(()=>{
                router.push('/login');
            },1500);
         }
         catch(error:unknown){
            console.log("Signup failed", error instanceof Error ? error.message : "Unknown error");
            toast.error("Signup failed. Please try again later.");
         }finally{
            setLoading(false);
         }
    }

    useEffect(()=>{
        if(user.email.length>0 && user.password.length>0 && user.username.length>0){
            setButtonDisabled(false);
        }
        else{
            setButtonDisabled(true);
        }
    },[user])

    return(   
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Toaster position="top-center" reverseOrder={false} />
        <h1>{loading ? "Loading..." : "Signup"} </h1>
        <hr/>
        <label htmlFor="username">Username:</label>
        <input className="p-2 border border-gray-50 rounded-lg mb-4 focus:outline-none focus:border-gray-600" 
            id="username"
            type="text"
            value={user.username}
            onChange={(e)=>setUser({...user,
            username:e.target.value})}
            placeholder="username"
        />
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
        onClick={onSignup}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
            {buttonDisabled ? "No Sign Up..." : "Signup"}
        </button>
        <Link href="/login" className="mt-4 text-blue-500 hover:underline">Visit Login Page</Link>
    </div>
)
}