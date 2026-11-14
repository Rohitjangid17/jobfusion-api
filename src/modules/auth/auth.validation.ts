import { z } from "zod";
import { USER_ROLES } from "../../shared/constants/index.js";

export const registerSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(72),
});

export const createUserSchema = registerSchema.extend({
    role: z.enum(USER_ROLES),
    companyId: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(72),
});

