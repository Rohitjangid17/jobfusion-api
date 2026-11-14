
import type { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { loginUser, registerUser } from "./auth.service.js";
import { ZodError } from "zod";

// register user
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqbody = registerSchema.parse(req.body);
        const result = await registerUser(reqbody);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Registration failed",
                errors: error.issues.map((e) => e.message),
            });
        }
        next(error);
    }
};

// login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = loginSchema.parse(req.body);
        const result = await loginUser(input);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
