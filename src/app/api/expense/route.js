let expenses = []; // In-memory storage for expenses

// Get expenses for a specific room_id or all expenses
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("room_id");

    // Return all expenses if no room_id is provided
    if (!roomId) {
      return new Response(JSON.stringify({ success: true, expenses }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Filter expenses by room_id
    const roomExpenses = expenses.filter(
      (expense) => expense.room_id === roomId
    );

    if (roomExpenses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No expenses found for the given room_id." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, expenses: roomExpenses }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Create a new expense
export async function POST(req) {
  try {
    const body = await req.json();
    const { room_id, details } = body;

    // Validate input
    if (!room_id) {
      return new Response(JSON.stringify({ error: "room_id is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!details || !Array.isArray(details) || details.length === 0) {
      return new Response(
        JSON.stringify({ error: "details should be a non-empty array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the expense object
    const newExpense = {
      room_id,
      details,
      createdAt: new Date().toISOString(),
    };

    // Add to expenses array
    expenses.push(newExpense);

    return new Response(
      JSON.stringify({ success: true, expense: newExpense }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Edit an existing expense by room_id
export async function PUT(req) {
  try {
    const body = await req.json();
    const { room_id, details } = body;

    // Validate input
    if (!room_id) {
      return new Response(JSON.stringify({ error: "room_id is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!details || !Array.isArray(details)) {
      return new Response(
        JSON.stringify({ error: "details should be an array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find and update the expense
    const expenseIndex = expenses.findIndex(
      (expense) => expense.room_id === room_id
    );

    if (expenseIndex === -1) {
      return new Response(
        JSON.stringify({ error: "No expense found for the given room_id." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update details
    expenses[expenseIndex].details = details;

    return new Response(
      JSON.stringify({ success: true, expense: expenses[expenseIndex] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
