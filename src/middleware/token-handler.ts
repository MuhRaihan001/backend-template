import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export async function generateToken(duration: number, data: any = {}){
    try{
        const secretKey = process.env.ACCESS_CODE as string;
        if(!secretKey) throw new Error('ACCES_CODE not found in environment variables.');
        const token = jwt.sign(data, secretKey,{  expiresIn: duration * 24 * 60 * 60 });
        return token;
    }catch(err){
        console.error('Error generating token:', err);
        throw err;
    }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try{
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token) return res.status(401).json({ error: 'Unauthorized' });
        const secretKey = process.env.ACCESS_CODE as string;
        if(!secretKey) throw new Error('ACCESS_CODE not found in environment variables.');
        const decoded = await jwt.verify(token, secretKey);
        req.user = decoded;
        next();

    }catch(err){
        console.error('Error verifying token:', err);
        res.status(401).json({ error: 'Unauthorized' });
    }
}