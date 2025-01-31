import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const data = await request.json();
        if (
            data.roomName &&
            data.roomDescription &&
            data.currencyId &&
            data.users.length > 0
        ) {
            const roomstr = Str_Random(50);
            const newRoom = await prisma.room.create({
                data: {
                    roomName: data.roomName,
                    roomHash: roomstr,
                    roomDescription: data.roomDescription,
                    currencyId: data.currencyId,
                },
            });

            const users = [];
            for (const user of data.users) {
                users.push({
                    userName: user.userName,
                    roomId: newRoom.id,
                });
            }

            await prisma.users.createMany({ data: users });

            return Response.json(
                {
                    message: "Room created",
                    roomHash: roomstr,
                },
                {
                    status: 200,
                }
            );
        }

        return Response.json(
            {
                message: "Invalid request body",
            },
            {
                status: 400,
            }
        );
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

function Str_Random(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const room = await prisma.room.findUnique({
        where: {
            roomHash: id,
        },
    });

    if (!room) {
        return Response.json(
            {
                message: "Room not found",
            },
            {
                status: 404,
            }
        );
    }

    return Response.json({
        message: "Room fetched",
        room: room,
    });
}
