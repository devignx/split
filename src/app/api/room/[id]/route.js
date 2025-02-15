import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { id } = await params; 

    try{
        const roomdata = await prisma.room.findUnique({
            where: {
                roomHash: id
            },
            include: {
                Users: true,
                Expense: true,
                currency: true
            }
        })

        return Response.json({
            message: "room data",
            data: roomdata
        }, {
            status: 200
        })
    }  
    catch(error) {
        console.log(error)
        return Response.json({
            message: "Internal Server error"
        }, {
            status: 500
        });
    }
}