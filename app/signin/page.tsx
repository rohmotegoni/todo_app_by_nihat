"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields before submission
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email) && email.length >= 8;
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid || !isPasswordValid) {
      setIsValidEmail(isEmailValid);
      setIsValidPassword(isPasswordValid);
      return; // Stop the submission if validation fails
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/signin`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-700"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-green-500">
            Login
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-4">
              {errorMessage}
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-400"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  const emailValue = e.target.value;
                  setEmail(emailValue);
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const isLengthValid = emailValue.length >= 8;
                  setIsValidEmail(emailRegex.test(emailValue) && isLengthValid);
                }}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  isValidEmail ? "border-gray-600" : "border-red-600"
                } rounded-md text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your email"
                required
              />
              {!isValidEmail && (
                <p className="text-red-500 text-xs">
                  Please enter a valid email with at least 8 characters.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    const passwordValue = e.target.value;
                    setPassword(passwordValue);
                    setIsValidPassword(passwordValue.length >= 6);
                  }}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    isValidPassword ? "border-gray-600" : "border-red-600"
                  } rounded-md text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-400 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              {!isValidPassword && (
                <p className="text-red-500 text-xs">
                  Password must be at least 6 characters long.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-green-400"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-green-500 hover:text-green-400"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          <p className="text-green-500 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-green-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="text-green-500 text-xs">
            &copy;2023 Hacker Corp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
