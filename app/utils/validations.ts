import { z } from "zod";
export const signupSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Must be a valid email" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
});
export type SignupSchema = z.infer<typeof signupSchema>;
export const signinschema = z.object({
    email: z.string({ required_error: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z
        .string({ required_error: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" }),
})
export type Signinschema = z.infer<typeof signinschema>;