import connectDb from "@/dbconfig/dbconfig";
import User from '@/models/userModel';
import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try{
        await connectDb();        
        const reqBody = await request.json()
        const {email, password} = reqBody;
        console.log(reqBody)

        // Find user by email
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({ error: "Invalid email or password"}, { status: 400 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json({ error: "Invalid email or password"}, { status: 400 });
        }
        
        // create token  data
        const tokenData = {
            id: user._id,
            username:user.username,
            email: user.email,
        }
        // create token with jwt
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '24h' });

        const response = NextResponse.json(
            { 
            message: "Login successful", 
            success:true 
        });

        response.cookies.set('token', token, {
            httpOnly: true, maxAge: 24 * 60 * 60 
        });
        return response;
    }
    catch(error: unknown){
        console.error("Login error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
        return NextResponse.json({ error: errorMessage}, { status: 400 });
    }
}