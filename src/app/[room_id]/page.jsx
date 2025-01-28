"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Room({ params }) {
    const { room_id } = params;

    const [roomData, setRoomData] = useState({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (room_id) {
            fetch(`/api/room?id=${room_id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setRoomData(data.room);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [room_id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Skeleton className="w-1/2 h-32" />
            </div>
        );
    }

    if (!roomData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600">
                    Room not found or an error occurred.
                </p>
            </div>
        );
    }

    const { roomName, roomDescription, users, currencyType, createdAt } =
        roomData;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {roomName}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                        Created on: {new Date(createdAt).toLocaleDateString()}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p className="text-gray-700">{roomDescription}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-gray-800">
                            Currency Type:{" "}
                            <span className="text-gray-700 font-medium">
                                {currencyType}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Users:</p>
                        <ul className="list-disc pl-4">
                            {users.map((user) => (
                                <li key={user.id} className="text-gray-700">
                                    {user.name || "Anonymous"}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
            <Button onClick={() => router.back()} className="mt-6">
                Go Back
            </Button>
        </div>
    );
}
