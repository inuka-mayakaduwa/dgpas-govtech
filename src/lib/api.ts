import { PermitApplication, PermitStatus } from "@/types";
import { CreatePermitInput, UpdatePermitStatusInput } from "@/validators/permitSchema";

const API_BASE = '/api/permits';

export async function createPermit(data: CreatePermitInput): Promise<PermitApplication> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create permit');
  }

  return response.json();
}

export async function getPermit(id: string): Promise<PermitApplication> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Permit not found');
    }
    throw new Error('Failed to fetch permit');
  }

  return response.json();
}

export async function listPermits(status?: PermitStatus | PermitStatus[]): Promise<PermitApplication[]> {
  const url = new URL(API_BASE, window.location.origin);

  if (status) {
    if (Array.isArray(status)) {
      status.forEach(s => url.searchParams.append('status', s));
    } else {
      url.searchParams.append('status', status);
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to list permits');
  }

  return response.json();
}

export async function updatePermitStatus(id: string, status: PermitStatus): Promise<PermitApplication> {
  const data: UpdatePermitStatusInput = { status };
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to update status');
  }

  return response.json();
}
