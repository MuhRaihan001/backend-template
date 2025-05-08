import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

export async function loginAsAdmin(username: string, password: string, req: Request){
    const adminUsername = process.env.ADMIN_USERNAME as string;
    const adminPassword = process.env.ADMIN_PASSWORD as string;

    if(!adminUsername || !adminPassword){
        throw new Error('Admin credentials are not set in the environment variables.');
    }

    if(username === adminUsername && password === adminPassword){
        req.user.role = 'admin';
        return true;
    }
    return false;
}