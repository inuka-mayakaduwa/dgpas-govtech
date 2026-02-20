import { prisma } from '@/lib/prisma';
import { PermitStatus, PermitApplication } from '@/types';
import { CreatePermitInput } from '@/validators/permitSchema';
import { EventEmitter } from 'events';
import { NotFoundError, ValidationError } from '@/lib/errors';

class PermitService extends EventEmitter {
    async createPermit(data: CreatePermitInput): Promise<PermitApplication> {
        return prisma.permitApplication.create({
            data: {
                ...data,
                status: PermitStatus.SUBMITTED,
            },
        });
    }

    async getPermit(id: string): Promise<PermitApplication | null> {
        return prisma.permitApplication.findUnique({
            where: { id },
        });
    }

    async listPermits(status?: PermitStatus | PermitStatus[]): Promise<PermitApplication[]> {
        let whereClause: any = {};

        if (status) {
            if (Array.isArray(status)) {
                whereClause.status = { in: status };
            } else {
                whereClause.status = status;
            }
        }

        return prisma.permitApplication.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }

    async updatePermitStatus(id: string, newStatus: PermitStatus): Promise<PermitApplication> {
        const permit = await this.getPermit(id);

        // Use custom NotFoundError
        if (!permit) {
            throw new NotFoundError(`Permit with ID ${id} not found`);
        }

        // This will throw a ValidationError if transition is invalid
        this.validateTransition(permit.status, newStatus);

        const updatedPermit = await prisma.permitApplication.update({
            where: { id },
            data: { status: newStatus },
        });

        this.emit('statusChanged', {
            permitId: permit.id,
            oldStatus: permit.status,
            newStatus: updatedPermit.status,
            timestamp: new Date().toISOString(),
        });

        return updatedPermit;
    }

    private validateTransition(currentStatus: PermitStatus, newStatus: PermitStatus) {
        const allowedTransitions: Record<PermitStatus, PermitStatus[]> = {
            [PermitStatus.SUBMITTED]: [PermitStatus.UNDER_REVIEW],
            [PermitStatus.UNDER_REVIEW]: [PermitStatus.APPROVED, PermitStatus.REJECTED],
            [PermitStatus.APPROVED]: [],
            [PermitStatus.REJECTED]: [],
        };

        const possibleTransitions = allowedTransitions[currentStatus];

        if (!possibleTransitions.includes(newStatus)) {
            // Use custom ValidationError
            throw new ValidationError(
                `Invalid status transition: Cannot move from ${currentStatus} to ${newStatus}`
            );
        }
    }
}

export const permitService = new PermitService();

// Event listener for logging
permitService.on('statusChanged', (event) => {
    console.log('PermitStatusChanged Event:', JSON.stringify(event, null, 2));
});