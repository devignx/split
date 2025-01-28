"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoom() {
    const [users, setUsers] = useState([{ name: "", email: "" }]);
    const [roomName, setRoomName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [currencyType, setCurrencyType] = useState("USD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleAddUser = () => {
        setUsers([...users, { name: "", email: "" }]);
    };

    const handleRemoveUser = (index) => {
        if (users.length > 1) {
            const newUsers = users.filter((_, i) => i !== index);
            setUsers(newUsers);
        }
    };

    const handleUserChange = (index, field, value) => {
        const newUsers = users.map((user, i) => {
            if (i === index) {
                return { ...user, [field]: value };
            }
            return user;
        });
        setUsers(newUsers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("/api/room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    users,
                    roomName,
                    roomDescription,
                    currencyType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setSuccess(true);
            console.log(data);
            router.push(`/${data?.room?.id}`);
            setRoomName("");
            setRoomDescription("");
            setUsers([{ name: "", email: "" }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Create New Room
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="bg-green-50 text-green-800 border-green-200">
                                <AlertDescription>
                                    Room created successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="roomName">Room Name</Label>
                            <Input
                                id="roomName"
                                placeholder="Enter room name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roomDescription">
                                Room Description
                            </Label>
                            <Textarea
                                id="roomDescription"
                                placeholder="Enter room description"
                                value={roomDescription}
                                onChange={(e) =>
                                    setRoomDescription(e.target.value)
                                }
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={currencyType}
                                onValueChange={setCurrencyType}
                            >
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">
                                        INR - Indian Rupee
                                    </SelectItem>
                                    <SelectItem value="USD">
                                        USD - US Dollar
                                    </SelectItem>
                                    <SelectItem value="EUR">
                                        EUR - Euro
                                    </SelectItem>
                                    <SelectItem value="GBP">
                                        GBP - British Pound
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Users</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddUser}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add User
                                </Button>
                            </div>

                            {users.map((user, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder="Name"
                                            value={user.name}
                                            onChange={(e) =>
                                                handleUserChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {/* <Input
                                            type="email"
                                            placeholder="Email"
                                            value={user.email}
                                            onChange={(e) =>
                                                handleUserChange(
                                                    index,
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        /> */}
                                    </div>
                                    {users.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleRemoveUser(index)
                                            }
                                            className="mt-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Room...
                                </>
                            ) : (
                                "Create Room"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
