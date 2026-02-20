'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { getPermit } from '@/lib/api';
import { PermitApplication } from '@/types';
import { Loader2, Search } from 'lucide-react';

export default function StatusPage() {
    const [searchId, setSearchId] = useState('');
    const [permit, setPermit] = useState<PermitApplication | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setError('');
        setPermit(null);

        try {
            const data = await getPermit(searchId);
            setPermit(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                        <CardTitle>Check Application Status</CardTitle>
                        <CardDescription>Enter your Permit ID to check the current status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Enter Permit ID"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                <span className="sr-only">Search</span>
                            </Button>
                        </form>

                        {error && (
                            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {permit && (
                            <div className="border rounded-md p-4 space-y-3 bg-muted/50">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-medium text-muted-foreground">Status:</span>
                                    <span className="font-bold">{permit.status}</span>

                                    <span className="font-medium text-muted-foreground">Business Name:</span>
                                    <span>{permit.businessName}</span>

                                    <span className="font-medium text-muted-foreground">Permit Type:</span>
                                    <span>{permit.permitType}</span>

                                    <span className="font-medium text-muted-foreground">Submitted On:</span>
                                    <span>{new Date(permit.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
