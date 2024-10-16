import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export default async function DELETE(req: NextRequest) {
  const prisma = new PrismaClient();
  const body = await req.json();
  const todoId = body.todoId;
  const todo = await prisma.todo.delete({
    where: {
      todoId: todoId,
    },
  });
  return NextResponse.json({ todo });
}
