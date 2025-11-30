// domain.com/verifytoken/assagarg --> server component ( easier way )
// domain.com/verifytoken?token=assagarg -> client Component ( easier way)

import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import connectDB from '@/dbconfig/dbconfig';

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        await connectDB();
        const hashedToken = await bcrypt.hash(userId.toString(), 10);
        
    if(emailType === "VERIFY"){
         const updatedUser = await User.findByIdAndUpdate(userId, {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000, // 1 hour
         }, { new: true });
         console.log("User updated with verify token:", updatedUser?.email, "Token saved:", !!updatedUser?.verifyToken);
    } else if(emailType === "RESET"){
         await User.findByIdAndUpdate(userId, {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
         });
    }

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER, 
            pass: process.env.MAILTRAP_PASS  
        }
    });

    const mailOptions = {
        from:'naveen@gmail.com',
        to:email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${process.env.domain}/verifymail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser: <br/><br/>${process.env.domain}/verifymail?token=${hashedToken}</p>`
    }

    const mainresponse = await transporter.sendMail(mailOptions);
    return mainresponse;

    } catch (error:any) {
        throw new Error(error.message);
    }
}