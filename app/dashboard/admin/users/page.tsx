"use client"

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, User as UserIcon, Trash2, Loader2 } from "lucide-react";

// Define a User type for clarity
interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'driver' | 'investor';
    createdAt: string;
}

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

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            toast({ title: "Error", description: "Could not load users.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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
                fetchUsers(); // Refresh users list
            } else {
                 const data = await res.json();
                toast({ title: "Update Failed", description: data.message || "Could not update user role.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

             const data = await res.json();

            if (res.ok) {
                toast({ title: "Success", description: "User has been deleted." });
                fetchUsers(); // Refresh users list
            } else {
                toast({ title: "Deletion Failed", description: data.message || "Could not delete the user.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "An unexpected error occurred during deletion.", variant: "destructive" });
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
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
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                 <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                     <AlertDialog>
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
                                                <DropdownMenuSeparator />
                                                 <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                 </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the user account
                                                    for <span className="font-semibold">{user.name}</span> and remove their data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}