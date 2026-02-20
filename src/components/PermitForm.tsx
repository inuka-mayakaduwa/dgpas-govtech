import { useState } from 'react';
import { createPermit } from '@/lib/api';
import { CreatePermitInput } from '@/validators/permitSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export function PermitForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');

  const [formData, setFormData] = useState<CreatePermitInput>({
    citizenId: '',
    businessName: '',
    permitType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessId('');

    try {
      const permit = await createPermit(formData);
      setSuccessId(permit.id);
      setFormData({ citizenId: '', businessName: '', permitType: '' });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Apply for Permit</CardTitle>
        <CardDescription>Submit your application details below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="citizenId">Citizen ID</Label>
            <Input
              id="citizenId"
              value={formData.citizenId}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
              required
              placeholder="e.g. 123456789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permitType">Permit Type</Label>
            <Select
              value={formData.permitType}
              onValueChange={(value) => setFormData({ ...formData, permitType: value })}
              required
            >
              <SelectTrigger id="permitType">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUSINESS_LICENSE">Business License</SelectItem>
                <SelectItem value="EVENT_PERMIT">Event Permit</SelectItem>
                <SelectItem value="CONSTRUCTION_PERMIT">Construction Permit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successId && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
              Application submitted successfully! <br />
              <strong>Permit ID:</strong> {successId}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
