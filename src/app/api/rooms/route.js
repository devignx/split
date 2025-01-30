import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return Response.json({
      message: "rooms",
      data: rooms,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Internal Server error",
      },
      {
        status: 500,
      }
    );
  }
}
