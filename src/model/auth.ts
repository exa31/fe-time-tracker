import type {Response} from "./index.ts";
import {z} from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(3, "name must be at least 3 characters"),
    email: z.string().email("invalid email"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirmPassword: z
        .string()
        .min(8, "password must be at least 8 characters"),
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    }
)

export const LoginSchema = z.object({
    email: z.string().email("Email Required"),
    password: z.string().min(1, "Password Required"),
})


export type RegisterRequest = z.infer<typeof RegisterSchema>

export type RegisterResponse = Response<string>

export type LoginRequest = z.infer<typeof LoginSchema>

export type LoginResponse = Response<{ token: string }>
