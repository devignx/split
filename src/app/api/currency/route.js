import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const currencies = await prisma.currency.findMany();

        return Response.json({
            message: "currencies",
            data: currencies
        }, {
            status: 200
        })
    }
    catch(error) {
        return Response.json({
            message: "Internal Server error"
        }, {
            status: 500
        });
    }
}

export async function POST(request) {
    try{
        const data = await request.json();

        if(data.symbol && data.name) {
            await prisma.currency.create({
                data: {
                    name: data.name,
                    symbol: data.symbol
                }
            })

            return Response.json({
                message: "currency added"
            }, {
                status: 200
            })
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


export async function PUT(request) {
    try{
        const data = await request.json();

        if(data.currency_id) {
            await prisma.currency.update({
                where: {
                    id: data.currency_id
                },
                data: {
                    name: data.name,
                    symbol: data.symbol
                }
            })

            return Response.json({
                message: "currency updated"
            }, {
                status: 201
            })
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
        console.log(error)
        return Response.json({
            message: "Internal Server error"
        }, {
            status: 500
        });
    }
}

export async function DELETE(request) {
    try {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const id = url.searchParams.get('id');
        
        if(id) {
            await prisma.currency.delete({
                where: {
                    id: parseInt(id)
                }
            });   

            return Response.json({
                message: "Currency deleted successfully",
            }, {
                status: 200
            });
        }
        else {
            return Response.json({
                message: "Invalid request",
            }, {
                status: 400
            });
        }

    } catch(error) {
        return Response.json({
            message: "Internal Server error"
        }, {
            status: 500
        });
    }
}