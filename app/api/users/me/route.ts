import { getTokendata } from "@/helpers/getTokendata";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connectDb from "@/dbconfig/dbconfig";

connectDb();

export async function GET(request:NextRequest){
    try{
        const userId = await getTokendata(request);
        const user = await User.findById(userId).select("-password -__v");
        return NextResponse.json({
            message: "User found" , data : user
        });
    }
    catch(error:unknown){
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 500 }
        );
    }
}