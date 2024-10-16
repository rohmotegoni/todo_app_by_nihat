import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  let cookie = req.cookies.get("userId");
  const userId = cookie ? parseInt(cookie.value) : null;

  try {
    // Ensure userId is valid before querying
    if (userId === null) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 }
      );
    }

    // Fetch todos for the user
    const todos = await prisma.todo.findMany({
      where: {
        userId: userId, // Ensure the field name matches your Prisma model
      },
    });

    // Return the fetched todos
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma Client disconnects
  }
}
