import express, { Request, Response } from 'express';
import { verifyToken } from '../../middleware/token-handler';
import { loginAsAdmin } from '../../controllers/admin/login';

const router = express.Router();

router.post('/', verifyToken, async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body;
        if(!username || !password) res.status(400).json({ error: 'Username and password are required.' });
        const loginSuccess = await loginAsAdmin(username, password, req);
        if(!loginSuccess) res.status(401).json({ error: 'Invalid credentials.' });
        res.status(200).json({ message: 'Login successful', role: req.user.role });
    }catch(err){
        console.error('Error in admin login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})