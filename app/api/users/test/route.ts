import connectDb from "@/dbconfig/dbconfig";
import User from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDb();
        const users = await User.find({});
        const userCount = await User.countDocuments();
        
        return NextResponse.json({ 
            success: true,
            count: userCount,
            users: users.map(u => ({
                id: u._id,
                username: u.username,
                email: u.email,
                isVerified: u.isVerified
            }))
        });
    } catch (error: unknown) {
        console.error("Error fetching users:", error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
