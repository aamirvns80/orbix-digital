"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // Need to ensure Switch exists or install it
import { Label } from "@/components/ui/label"; // Need Label too
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function AutomationsPage() {
    // Mock state for now, as we haven't built the full TRPC router for managing configuration
    // In a real app, this would fetch from `automations` table
    const [settings, setSettings] = useState({
        notifyOnTicket: true,
        notifyOnLeadWon: true,
        emailOnLeadCreated: false,
    });

    const handleSave = () => {
        // Here we would call a mutation to save settings
        toast.success("Automation settings saved");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Automations</h1>
                <p className="text-muted-foreground">Manage your agency's automated workflows.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure when you and your team receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notify-ticket" className="flex flex-col space-y-1">
                            <span>New Ticket Alerts</span>
                            <span className="font-normal text-muted-foreground">Notify admins when a client creates a new ticket.</span>
                        </Label>
                        <Switch
                            id="notify-ticket"
                            checked={settings.notifyOnTicket}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, notifyOnTicket: c }))}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notify-lead" className="flex flex-col space-y-1">
                            <span>Lead Won Alerts</span>
                            <span className="font-normal text-muted-foreground">Notify the team when a deal is marked as "Won".</span>
                        </Label>
                        <Switch
                            id="notify-lead"
                            checked={settings.notifyOnLeadWon}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, notifyOnLeadWon: c }))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Email Workflows</CardTitle>
                    <CardDescription>Automated email sequences sent to leads and clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-welcome" className="flex flex-col space-y-1">
                            <span>Welcome Email</span>
                            <span className="font-normal text-muted-foreground">Send a welcome email when a new lead is created.</span>
                        </Label>
                        <Switch
                            id="email-welcome"
                            checked={settings.emailOnLeadCreated}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, emailOnLeadCreated: c }))}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
