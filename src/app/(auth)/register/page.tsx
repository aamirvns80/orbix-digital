"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/ui/toast";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    function updateField(field: string, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                toast(data.error || "Registration failed");
                return;
            }

            toast("Account created! Redirecting to login...");
            router.push("/login");
        } catch {
            toast("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">OrbixDigital</span>
                </Link>
                <ThemeToggle />
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-6 animate-fade-up">
                    <Card className="shadow-xl border-border">
                        <CardHeader className="text-center space-y-2">
                            <CardTitle className="text-2xl">Create your account</CardTitle>
                            <CardDescription>
                                Get started with OrbixDigital in seconds
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@agency.com"
                                        value={formData.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => updateField("password", e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    variant="default"
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                    Create Account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
