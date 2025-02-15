import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get("roomId");

        // Return all expenses if no room_id is provided
        if (!roomId) {
            return new Response(
                JSON.stringify({ error: "roomId is required." }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Filter expenses by room_id
        const roomExpenses = await prisma.expense.findMany({
            where: { roomId: parseInt(roomId) },
            include: { room: true, spentBy: true },
        });

        if (roomExpenses.length === 0) {
            return new Response(
                JSON.stringify({
                    error: "No expenses found for the given room_id.",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, expenses: roomExpenses }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function POST(request) {
  try {
    const data = request.json();
    
    if(data.roomId && data.name && data.amount && data.spenderId && data.owes) {
      const expense = await prisma.expense.create({
        data: {
          roomId: data.roomId,
          name: data.name,
          amount: data.amount,
          spentById: data.spenderId
        }
      })

      const splitAmount = data.users.length == 0? 0: data.amount/data.users.length;

      data.owes.forEach(async (user) => {
        await prisma.settles.create({
          data: {
            owedTo: data.spenderId,
            owedBy: user.userId,
            amount: splitAmount
          }
        })
      })

      
    }
  }
  catch(error) {
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

// Edit an existing expense by id
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, amount, spentById } = body;

        // Validate input
        if (!id) {
            return new Response(JSON.stringify({ error: "id is required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find and update the expense
        const updatedExpense = await prisma.expense.update({
            where: { id: parseInt(id) },
            data: {
                name,
                amount: amount ? parseFloat(amount) : undefined,
                spentById: spentById ? parseInt(spentById) : undefined,
            },
        });

        return new Response(
            JSON.stringify({ success: true, expense: updatedExpense }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new Response(JSON.stringify({ error: "id is required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const deletedExpense = await prisma.expense.delete({
            where: { id: parseInt(id) },
        });

        return new Response(
            JSON.stringify({ success: true, expense: deletedExpense }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
