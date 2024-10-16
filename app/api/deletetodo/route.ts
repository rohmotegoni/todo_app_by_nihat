import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function DELETE(req: NextRequest) {
  const prisma = new PrismaClient();
  // Get todoId from query params
  // Get the todoId from query parameters
  const todoId = req.headers.get("todoId");
  console.log(todoId);
  if (!todoId) {
    console.log("Todo ID is required");
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  try {
    const todo = await prisma.todo.delete({
      where: {
        todoId: Number(todoId), // Convert todoId to number
      },
    });
    return NextResponse.json({ todo });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
