const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050';

export async function fetchVehicles() {
  const res = await fetch(`${API_BASE}/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchVehicleById(id: string) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`);
  if (!res.ok) throw new Error('Failed to fetch vehicle');
  return res.json();
}

export async function createVehicle(data: any) {
  const res = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create vehicle');
  return res.json();
}

export async function deleteVehicle(id: string) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete vehicle');
  return res.json();
}

export async function fetchServices(vehicleId?: string) {
  const url = vehicleId ? `${API_BASE}/services?vehicleId=${vehicleId}` : `${API_BASE}/services`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function createService(data: any) {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to record service');
  return res.json();
}

export async function fetchFuelLogs(vehicleId?: string) {
  const url = vehicleId ? `${API_BASE}/fuel?vehicleId=${vehicleId}` : `${API_BASE}/fuel`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch fuel logs');
  return res.json();
}

export async function createFuelLog(data: any) {
  const res = await fetch(`${API_BASE}/fuel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to log fuel');
  return res.json();
}

export async function uploadDocument(formData: FormData) {
  const res = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function deleteDocument(id: string) {
  const res = await fetch(`${API_BASE}/files/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export { API_BASE };
