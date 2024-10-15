"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { signupSchema, SignupSchema } from "../utils/validations";
const backendurl = process.env.BACKEND_URL;
export default function SignupForm() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<SignupSchema>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to validate the form using Zod
  const validateForm = () => {
    const result = signupSchema.safeParse({ name, email, password });

    if (!result.success) {
      const errorMessages = result.error.flatten().fieldErrors;
      setErrors({
        name: errorMessages.name?.[0],
        email: errorMessages.email?.[0],
        password: errorMessages.password?.[0],
      });
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate the form before submitting
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendurl}/api/auth/signup`, {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        router.push("/");
      } else {
        console.error("Error in response:", response.data);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-green-500 text-lg font-semibold">
              Signing up...
            </p>
          </div>
        </div>
      )}
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-700"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-green-500">
            Signup
          </h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-green-400 text-sm font-bold mb-2"
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-3 pr-3 py-2 text-green-400 bg-gray-700 border ${
                  errors.name ? "border-red-600" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your username"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-green-400 text-sm font-bold mb-2"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-3 pr-3 py-2 text-green-400 bg-gray-700 border ${
                  errors.email ? "border-red-600" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-green-400 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-3 pr-3 py-2 text-green-400 bg-gray-700 border ${
                  errors.password ? "border-red-600" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-green-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-green-500 hover:text-green-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
        <p className="text-center text-green-500 text-xs">
          &copy;2023 Hacker Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
}
