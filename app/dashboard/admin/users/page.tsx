"use client"

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/models/User"; // Assuming User model can be imported
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, User as UserIcon } from "lucide-react";

async function getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    const data = await res.json();
    return data.users;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, [toast]);

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'driver' | 'investor') => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                toast({ title: "Success", description: "User role updated successfully." });
                // Refresh users list
                const updatedUsers = await getUsers();
                setUsers(updatedUsers);
            } else {
                 const data = await res.json();
                toast({ title: "Update Failed", description: data.message || "Could not update user role.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading users...</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="bg-card rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                             <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                 <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'admin')}>
                                                <Shield className="mr-2 h-4 w-4" />
                                                Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'investor')}>
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                Make Investor
                                            </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'driver')}>
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                Make Driver
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}