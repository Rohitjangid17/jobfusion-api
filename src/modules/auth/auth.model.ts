import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { USER_ROLES } from "../../shared/constants/index.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: USER_ROLES,
        default: "candidate",
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        default: null,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export type UserDocument = InferSchemaType<typeof userSchema>;

const User = mongoose.model("User", userSchema);

export default User;