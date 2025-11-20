import { Request, Response } from 'express';
import { z } from "zod";
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../db/queries';

const validateUser = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be 8 characters long"),
});

export const register = async (req: Request, res: Response) => {
    try {
        const result = validateUser.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const {email, password} = result.data;
        const checkUser = await getUserByEmail(email);

        if (checkUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await createUser(email, hashPassword, 'user');

        const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "string", { expiresIn: '1h' });
        const refreshToken = jwt.sign({userId: user.id},  process.env.JWT_REFRESH_SECRET || "refresh-secret", { expiresIn: '2h' });

        res.status(201).json({
            accessToken,
            refreshToken,
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (err:any) {
        res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = validateUser.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const {email, password} = result.data;
        const findUser = await getUserByEmail(email);

        if (!findUser) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const checkPassword = await bcrypt.compare(password, findUser.passwordHash);

        if (!checkPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const accessToken = jwt.sign({ userId: findUser.id, role: findUser.role }, process.env.JWT_SECRET || "string", { expiresIn: '1h' });
        const refreshToken = jwt.sign({userId: findUser.id, role: findUser.role},  process.env.JWT_REFRESH_SECRET || "refresh-secret", { expiresIn: '2h' });

        res.status(200).json({
            accessToken,
            refreshToken,
            id: findUser.id,
            email: findUser.email,
            role: findUser.role,
            createdAt: findUser.createdAt,
        })
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token required" });
        }

        const decoded = jwt.verify(refreshToken,  process.env.JWT_REFRESH_SECRET || "refresh-secret") as JwtPayload;

        const newAccessToken = jwt.sign(
                { userId: decoded.userId, role: decoded.role }, 
                process.env.JWT_SECRET || "string", 
                { expiresIn: '1h' }
            );
        res.status(200).json({
            accessToken: newAccessToken
        })
    } catch (error) {
        res.status(401).json({ error: "Invalid refresh token "});
    }
};