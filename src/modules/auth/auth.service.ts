
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import type { z } from "zod";
import type { registerSchema, loginSchema } from "./auth.validation.js";
import { JWT_SECRET } from "../../shared/constants/index.js";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

const createToken = (user_id: string): string => {
    const secret = JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters");
    }

    return jwt.sign({ sub: user_id }, secret, {
        expiresIn: "1d",
    });
}

const publicUser = (user: { _id: unknown; name: string; email: string; role: string; company_id?: unknown; }) => {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company_id ?? null,
    };
}

export const registerUser = async (input: RegisterInput) => {
    console.log("Registering user with input:", input);
    const email = input.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw Object.assign(new Error("Email is already registered"), {
            statusCode: 409,
        });
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await User.create({
        name: input.name,
        email,
        password: hashedPassword,
        role: "candidate",
    });

    return {
        user: publicUser(user),
        token: createToken(String(user._id)),
    };
}

export const loginUser = async (input: LoginInput) => {
    const email = input.email.toLowerCase().trim();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw Object.assign(new Error("Invalid email or password"), {
            statusCode: 401,
        });
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
        throw Object.assign(new Error("Invalid email or password"), {
            statusCode: 401,
        });
    }

    if (!user.is_active) {
        throw Object.assign(new Error("Account is disabled"), {
            statusCode: 403,
        });
    }

    return {
        user: publicUser(user),
        token: createToken(String(user._id)),
    };
}
