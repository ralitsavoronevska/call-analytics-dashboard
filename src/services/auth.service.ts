
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface LoginCredentials {
  email: string
  password: string
}

interface TokenResponse {
  access_token: string
  token_type: "bearer"
}

export async function login(
  credentials: LoginCredentials,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid email or password")
    }

    throw new Error(`Login failed: HTTP ${response.status}`)
  }

  const data: TokenResponse = await response.json()

  return data.access_token
}
