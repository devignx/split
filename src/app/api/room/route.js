import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const data = await request.json();
        if(data.roomName && data.roomDescription && data.currencyId && data.users.length>0) {
            const roomstr = Str_Random(50);
            const newRoom = await prisma.room.create({
                data: {
                    roomName: data.roomName,
                    roomHash: roomstr,
                    roomDescription: data.roomDescription,
                    currencyId: data.currencyId,
                }
            })

            const users = []
            data.users.forEach((user)=> {
                users.push({
                    userName: user.userName,
                    roomId: newRoom.id
                })
            })

            await prisma.users.createMany({ data: users })

            return Response.json({
                message: "Room created"
            }, {
                status: 200
            });
        }
        else {
            return Response.json({
                message: "Invalid request body"
            }, {
                status: 400
            })
        }
    }
    catch(error) {
        return Response.json({
            message: "Internal Server error"
        }, {
            status: 500
        });
    }
}

function Str_Random(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}