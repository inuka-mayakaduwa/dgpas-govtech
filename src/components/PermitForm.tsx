import { useState } from 'react';
import { createPermit } from '@/lib/api';
import { CreatePermitInput } from '@/validators/permitSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ApiValidationError {
  error: string;
  details?: {
    [key: string]: string[];
  };
}

export function PermitForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errorReason, setErrorReason] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successId, setSuccessId] = useState('');

  const [formData, setFormData] = useState<CreatePermitInput>({
    citizenId: '',
    businessName: '',
    permitType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Frontend Validation Check ---
    if (!formData.permitType) {
      setErrorReason('Form Submission Failed');
      setFieldErrors({
        permitType: ['Please select a permit type before submitting.']
      });
      return;
    }
    // ---------------------------------

    setLoading(true);
    setErrorReason('');
    setFieldErrors({});
    setSuccessId('');

    try {
      const permit = await createPermit(formData);
      setSuccessId(permit.id);
      setFormData({ citizenId: '', businessName: '', permitType: '' });
      onSuccess();
    } catch (err: any) {
      const apiError = err as ApiValidationError;
      setErrorReason(apiError.error || 'An unexpected error occurred');
      if (apiError.details) {
        setFieldErrors(apiError.details);
      }
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

          {errorReason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorReason}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="citizenId" className={fieldErrors.citizenId ? "text-red-500" : ""}>
              Citizen ID
            </Label>
            <Input
              id="citizenId"
              required // Native HTML validation
              value={formData.citizenId}
              className={fieldErrors.citizenId ? "border-red-500" : ""}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
              placeholder="e.g. 123456789"
            />
            {fieldErrors.citizenId?.map((msg) => (
              <p key={msg} className="text-xs font-medium text-red-500">{msg}</p>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName" className={fieldErrors.businessName ? "text-red-500" : ""}>
              Business Name
            </Label>
            <Input
              id="businessName"
              required // Native HTML validation
              value={formData.businessName}
              className={fieldErrors.businessName ? "border-red-500" : ""}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Acme Corp"
            />
            {fieldErrors.businessName?.map((msg) => (
              <p key={msg} className="text-xs font-medium text-red-500">{msg}</p>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="permitType" className={fieldErrors.permitType ? "text-red-500" : ""}>
              Permit Type
            </Label>
            <Select
              value={formData.permitType}
              onValueChange={(value) => {
                setFormData({ ...formData, permitType: value });
                // Clear error immediately when user picks something
                if (fieldErrors.permitType) {
                  setFieldErrors(prev => ({ ...prev, permitType: [] }));
                }
              }}
              required // Added required prop to Select
            >
              <SelectTrigger
                id="permitType"
                className={fieldErrors.permitType ? "border-red-500 ring-red-500" : ""}
              >
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUSINESS_LICENSE">Business License</SelectItem>
                <SelectItem value="EVENT_PERMIT">Event Permit</SelectItem>
                <SelectItem value="CONSTRUCTION_PERMIT">Construction Permit</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.permitType?.map((msg) => (
              <p key={msg} className="text-xs font-medium text-red-500">{msg}</p>
            ))}
          </div>

          {successId && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              <strong>Application submitted successfully!</strong> <br />
              <span className="text-xs">Permit ID: {successId}</span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}