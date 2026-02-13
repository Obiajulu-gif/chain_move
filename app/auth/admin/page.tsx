"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// New API route to check admin registration status
async function getAdminRegistrationStatus() {
    try {
        const res = await fetch('/api/auth/admin/status'); // We will create this helper endpoint
        const data = await res.json();
        return data.isOpen;
    } catch (error) {
        return false;
    }
}

export default function AdminAuthPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Page state
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            const isOpen = await getAdminRegistrationStatus();
            setIsRegistrationOpen(isOpen);
            setIsLoadingStatus(false);
        };
        checkStatus();
    }, []);

    const handleAdminSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/admin/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast({
                    title: "Admin Account Created",
                    description: "You have successfully created the admin account. Please sign in.",
                });
                router.push('/signin');
            } else {
                setError(data.message || "An error occurred.");
            }
        } catch (err) {
            setError("A network error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoadingStatus) {
        return (
             <div className="min-h-screen bg-gradient-to-br from-[#142841] to-[#3A7CA5] flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#142841] via-[#1e3a5f] to-[#3A7CA5] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center text-white hover:text-[#E57700] mb-6 transition-colors">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex items-center justify-center mb-4">
                        <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={48} height={48} className="mr-3" />
                        <h1 className="text-3xl font-bold text-white">ChainMove</h1>
                    </div>
                </div>

                <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-[#142841]">
                            Admin Registration
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                           {isRegistrationOpen ? "Create the primary administrator account." : "Admin registration is closed."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isRegistrationOpen ? (
                            <form onSubmit={handleAdminSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" placeholder="Admin Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <Button type="submit" disabled={isLoading} className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white py-3">
                                    {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                                </Button>
                            </form>
                       ) : (
                            <Alert variant="default" className="bg-yellow-100 border-yellow-300 text-yellow-800">
                                <Shield className="h-4 w-4 text-yellow-700" />
                                <AlertDescription>
                                    Admin registration is closed because an administrator account already exists. 
                                    For security reasons, new admins can only be appointed by an existing admin from the user management dashboard.
                                </AlertDescription>
                            </Alert>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}