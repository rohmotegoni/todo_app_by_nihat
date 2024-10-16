import { createTodoSchema } from "@/app/lib/validations";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();
  const body = await req.json();

  const parsedBody = createTodoSchema.safeParse(body);
  if (parsedBody.success === false) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }

  try {
    const id = req.cookies.get("userId");
    const userId = id ? parseInt(id.value) : null;

    if (userId === null) {
      return NextResponse.json({ message: "Invalid userId." }, { status: 400 });
    }

    const response = await prisma.todo.create({
      data: {
        title: body.title,
        description: body.description,
        userId: userId,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected
  }
}
