"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2, Plus, Copy, Check, Eye, TestTube, Key } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function IntegrationsPage() {
    const { data: apiKeys, refetch: refetchKeys } = trpc.integrations.listApiKeys.useQuery();
    const { data: webhooks, refetch: refetchWebhooks } = trpc.integrations.listWebhooks.useQuery();

    const [newKeyName, setNewKeyName] = useState("");
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);

    const [newWebhookUrl, setNewWebhookUrl] = useState("");
    const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);

    const createKeyMutation = trpc.integrations.createApiKey.useMutation({
        onSuccess: (data) => {
            setCreatedKey(data.key);
            setNewKeyName("");
            refetchKeys();
            toast.success("API Key created");
        }
    });

    const revokeKeyMutation = trpc.integrations.revokeApiKey.useMutation({
        onSuccess: () => {
            toast.success("API Key revoked");
            refetchKeys();
        }
    });

    const createWebhookMutation = trpc.integrations.createWebhook.useMutation({
        onSuccess: () => {
            setNewWebhookUrl("");
            setIsWebhookDialogOpen(false);
            refetchWebhooks();
            toast.success("Webhook registered");
        }
    });

    const deleteWebhookMutation = trpc.integrations.deleteWebhook.useMutation({
        onSuccess: () => {
            toast.success("Webhook deleted");
            refetchWebhooks();
        }
    });

    const testWebhookMutation = trpc.integrations.testWebhook.useMutation({
        onSuccess: () => toast.success("Test ping sent!"),
        onError: () => toast.error("Test ping failed")
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground">Manage API keys and Webhooks to connect external tools.</p>
            </div>

            <Tabs defaultValue="api-keys" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                </TabsList>

                <TabsContent value="api-keys" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium">Active API Keys</h2>
                        <Dialog open={isKeyDialogOpen} onOpenChange={(open) => {
                            if (!open) setCreatedKey(null); // Reset on close
                            setIsKeyDialogOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Create New Key</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create API Key</DialogTitle>
                                    <DialogDescription>
                                        Generate a new key to access the OrbixDigital API.
                                    </DialogDescription>
                                </DialogHeader>

                                {!createdKey ? (
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Key Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Zapier Integration"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                            />
                                        </div>
                                        <Button onClick={() => createKeyMutation.mutate({ name: newKeyName })} disabled={!newKeyName || createKeyMutation.isPending}>
                                            {createKeyMutation.isPending ? "Generating..." : "Generate Key"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 py-4">
                                        <Alert className="bg-green-50 border-green-200">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <AlertTitle className="text-green-800">Key Generated!</AlertTitle>
                                            <AlertDescription className="text-green-700">
                                                Copy this key now. You won't be able to see it again.
                                            </AlertDescription>
                                        </Alert>
                                        <div className="flex items-center space-x-2">
                                            <Input value={createdKey} readOnly className="font-mono bg-muted" />
                                            <Button size="icon" variant="outline" onClick={() => copyToClipboard(createdKey)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Prefix</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Last Used</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys?.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{key.prefix}</TableCell>
                                        <TableCell>{format(new Date(key.createdAt), "MMM d, yyyy")}</TableCell>
                                        <TableCell>{key.lastUsedAt ? format(new Date(key.lastUsedAt), "MMM d, yyyy") : "Never"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => revokeKeyMutation.mutate({ id: key.id })}>
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {apiKeys?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No active API keys.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="webhooks" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium">Webhook Endpoints</h2>
                        <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Add Webhook</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Webhook</DialogTitle>
                                    <DialogDescription>
                                        We'll send POST requests to this URL for all events.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="url">Endpoint URL</Label>
                                        <Input
                                            id="url"
                                            placeholder="https://api.yourservice.com/webhooks"
                                            value={newWebhookUrl}
                                            onChange={(e) => setNewWebhookUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => createWebhookMutation.mutate({ url: newWebhookUrl, events: ["*"] })}
                                        disabled={!newWebhookUrl || createWebhookMutation.isPending}
                                    >
                                        {createWebhookMutation.isPending ? "Adding..." : "Add Webhook"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Events</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {webhooks?.map((hook) => (
                                    <TableRow key={hook.id}>
                                        <TableCell className="font-mono text-xs">{hook.url}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">All Events</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={hook.isActive ? "bg-green-500" : "bg-gray-500"}>
                                                {hook.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => testWebhookMutation.mutate({ url: hook.url })} title="Test Webhook">
                                                <TestTube className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteWebhookMutation.mutate({ id: hook.id })} title="Delete">
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {webhooks?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No webhooks configured.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
