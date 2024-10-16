"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2, List } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      let response = await axios.post(`/api/createtodo`, {
        title,
        description,
      });
      if (response.status === 200) {
        setSuccessMessage("Todo created successfully!");
        setTitle("");
        setDescription("");
        setTimeout(() => {
          router.push("/createtodo");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      <div
        className={`w-full max-w-md transition-all duration-300 ${
          isLoading ? "blur-sm" : ""
        }`}
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create a New Todo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter todo title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter todo description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Creating..." : "Create Todo"}
              </Button>
            </form>
            {successMessage && (
              <div className="mt-4 text-green-600 font-semibold text-center">
                {successMessage}
              </div>
            )}
            <div className="mt-4">
              <Link href="/viewtodos" passHref>
                <Button variant="outline" className="w-full">
                  <List className="mr-2 h-4 w-4" />
                  See Todos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
