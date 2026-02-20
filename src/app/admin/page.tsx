'use client';

import { useEffect, useState } from 'react';
import { listPermits, updatePermitStatus } from '@/lib/api';
import { PermitApplication, PermitStatus } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/Navbar';


export default function AdminPage() {
    const [permits, setPermits] = useState<PermitApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<PermitStatus | 'ALL' | 'PENDING'>('PENDING');

    const fetchPermits = async () => {
        setLoading(true);
        try {
            let status: PermitStatus | PermitStatus[] | undefined;
            if (filter === 'PENDING') {
                status = [PermitStatus.SUBMITTED, PermitStatus.UNDER_REVIEW];
            } else if (filter !== 'ALL') {
                status = filter;
            }
            const data = await listPermits(status);
            setPermits(data);
        } catch (error) {
            console.error('Failed to fetch permits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermits();
    }, [filter]);

    const handleStatusUpdate = async (id: string, newStatus: PermitStatus) => {
        setUpdating(id);
        try {
            await updatePermitStatus(id, newStatus);
            // Optimistic update or refetch
            setPermits(permits.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (error: any) {
            console.error('Failed to update status:', error);
            alert(error.message); // Simple alert fallback
        } finally {
            setUpdating(null);
        }
    };

    const getStatusBadgeVariant = (status: PermitStatus) => {
        switch (status) {
            case 'APPROVED': return 'default'; // often green/primary
            case 'REJECTED': return 'destructive';
            case 'UNDER_REVIEW': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Permit Administration</h1>
                    <div className="flex gap-4">
                        <Button onClick={fetchPermits} variant="outline" size="icon">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>All Applications</CardTitle>
                                <CardDescription>Manage and review permit applications.</CardDescription>
                            </div>
                            <div className="w-[250px]">
                                <Select value={filter} onValueChange={(val) => setFilter(val as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending Attention</SelectItem>
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        {Object.values(PermitStatus).map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            {/* Using a standard HTML table structure if shadcn Table isn't fully imported yet, but let's try using the components assuming standard shadcn structure */}
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID / Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Applicant</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Current Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {permits.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No permits found.
                                            </td>
                                        </tr>
                                    ) : (
                                        permits.map((permit) => (
                                            <tr key={permit.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    <div className="font-mono text-xs">{permit.id.slice(0, 8)}...</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(permit.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="font-medium">{permit.businessName}</div>
                                                    <div className="text-xs text-muted-foreground">{permit.citizenId}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant="outline">{permit.permitType.replace('_', ' ')}</Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={getStatusBadgeVariant(permit.status)}>
                                                        {permit.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex gap-2">
                                                        {permit.status === PermitStatus.SUBMITTED && (
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                disabled={updating === permit.id}
                                                                onClick={() => handleStatusUpdate(permit.id, PermitStatus.UNDER_REVIEW as PermitStatus)}
                                                            >
                                                                {updating === permit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark as Pending Review'}
                                                            </Button>
                                                        )}
                                                        {permit.status === PermitStatus.UNDER_REVIEW && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    disabled={updating === permit.id}
                                                                    onClick={() => handleStatusUpdate(permit.id, PermitStatus.APPROVED as PermitStatus)}
                                                                >
                                                                    {updating === permit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    disabled={updating === permit.id}
                                                                    onClick={() => handleStatusUpdate(permit.id, PermitStatus.REJECTED as PermitStatus)}
                                                                >
                                                                    {updating === permit.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deny'}
                                                                </Button>
                                                            </>
                                                        )}
                                                        {(permit.status === PermitStatus.APPROVED || permit.status === PermitStatus.REJECTED) && (
                                                            <span className="text-xs text-muted-foreground italic">No actions available</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
