import { z } from 'zod';
import { PermitStatus } from '@/types';

export const createPermitSchema = z.object({
    citizenId: z.string().min(1, 'Citizen ID is required'),
    businessName: z.string().min(1, 'Business Name is required'),
    permitType: z.string().min(1, 'Permit Type is required'),
});

export const updatePermitStatusSchema = z.object({
    status: z.nativeEnum(PermitStatus),
});

export type CreatePermitInput = z.infer<typeof createPermitSchema>;
export type UpdatePermitStatusInput = z.infer<typeof updatePermitStatusSchema>;
