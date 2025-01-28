import { v4 as uuidv4 } from "uuid"; // For unique IDs

let rooms = []; // In-memory storage for demonstration (replace with DB in production)

export async function GET() {
  // Fetch all rooms
  return new Response(JSON.stringify({ success: true, rooms }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
export async function GET(req) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("id");

    // Validate the room ID
    if (!roomId) {
      return new Response(JSON.stringify({ error: "Room ID is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the room by ID
    const room = rooms.find((r) => r.id === roomId);

    // Handle case where the room is not found
    if (!room) {
      return new Response(JSON.stringify({ error: "Room not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the room details
    return new Response(JSON.stringify({ success: true, room }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { users, roomName, roomDescription, currencyType } = body;

    // Validation
    if (!users || !Array.isArray(users) || users.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Users are required and should be a non-empty array.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate unique user IDs for each user
    const enrichedUsers = users.map((user) => ({
      ...user,
      id: uuidv4(), // Generate a unique ID for each user
    }));

    // Generate unique room ID
    const roomId = uuidv4();

    // Create the room object
    const newRoom = {
      id: roomId,
      users: enrichedUsers,
      roomName: roomName || "Untitled Room", // Default if not provided
      roomDescription: roomDescription || "No description provided.",
      currencyType: currencyType || "USD", // Default currency
      createdAt: new Date().toISOString(),
    };

    // Save the room to the in-memory array (replace this with DB logic)
    rooms.push(newRoom);

    return new Response(JSON.stringify({ success: true, room: newRoom }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
