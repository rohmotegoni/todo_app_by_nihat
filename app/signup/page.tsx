"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignupForm() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!name.trim()) {
      newErrors.name = "Username is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/signup`, {
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
            <Label htmlFor="username" className="text-green-400">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-500"
              placeholder="Enter your username"
            />
            {errors.name && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="text-green-400">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.email}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="text-green-400">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errors.password}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Sign Up
            </Button>
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
