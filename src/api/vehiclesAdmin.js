const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(method, path, token, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Ocurrió un error.");
  }

  return data;
}

export const fetchAdminVehicles = (token) => request("GET", "/api/vehicles/admin", token);
export const createVehicle = (token, payload) => request("POST", "/api/vehicles", token, payload);
export const updateVehicle = (token, id, payload) =>
  request("PUT", `/api/vehicles/${id}`, token, payload);
export const setVehicleStatus = (token, id, status) =>
  request("PATCH", `/api/vehicles/${id}/status`, token, { status });
export const deleteVehicle = (token, id) => request("DELETE", `/api/vehicles/${id}`, token);
