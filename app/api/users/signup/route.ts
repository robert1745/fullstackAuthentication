import connectDb from "@/dbconfig/dbconfig";
import User from '@/models/userModel';
import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
    try{
        await connectDb();
        
        const reqBody = await request.json()
        const {username, email, password} = reqBody;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({ error: "User already exists"}, { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
        return NextResponse.json(
            { message: "User registered successfully", success:true, savedUser });

    }
    catch(error: unknown){
        console.error("Signup error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
        return NextResponse.json({ error: errorMessage}, { status: 400 });
    }
}