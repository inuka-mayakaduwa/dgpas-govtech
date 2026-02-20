import { PermitStatus } from '../../generated/prisma/enums';

export { PermitStatus };

export interface PermitApplication {
    id: string;
    citizenId: string;
    businessName: string;
    permitType: string;
    status: PermitStatus;
    createdAt: Date | string;
    updatedAt: Date | string;
}
