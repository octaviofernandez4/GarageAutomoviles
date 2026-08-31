const API_BASE = import.meta.env.VITE_API_URL || "";

export async function fetchVehicles() {
  const res = await fetch(`${API_BASE}/api/vehicles`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicles: ${res.status}`);
  }
  return res.json();
}

export async function fetchVehicleById(id) {
  const res = await fetch(`${API_BASE}/api/vehicles/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle: ${res.status}`);
  }
  return res.json();
}

export async function fetchVehicleMeta() {
  const res = await fetch(`${API_BASE}/api/vehicles/meta`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle meta: ${res.status}`);
  }
  return res.json();
}
