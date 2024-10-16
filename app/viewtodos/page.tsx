"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export function ViewTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/viewtodos");
      setTodos(response.data);
    } catch (err) {
      setError("Failed to fetch todos. Please try again.");
      console.error("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async () => {
    setIsCreating(true);
    try {
      // Simulate API call (replace with actual API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // After successful creation, refresh the todo list
      await fetchTodos();
    } catch (err) {
      setError("Failed to create todo. Please try again.");
      console.error("Error creating todo:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await axios.post("/api/deletetodo", {
        todoId: todoId,
      });
      // After successful deletion, refresh the todo list
      await fetchTodos();
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 relative">
      {isCreating && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      <div
        className={`transition-all duration-300 ${isCreating ? "blur-sm" : ""}`}
      >
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Your Todos</CardTitle>
            <div className="space-x-2">
              <Button onClick={fetchTodos} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleCreateTodo}
                variant="outline"
                size="icon"
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : todos.length === 0 ? (
              <div className="text-center text-gray-500">
                No todos found. Create one to get started!
              </div>
            ) : (
              <ul className="space-y-4">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{todo.title}</h3>
                      <p className="text-sm text-gray-600">
                        {todo.description}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            todo.completed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {todo.completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteTodo(todo.id)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default ViewTodos;
