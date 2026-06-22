export const API_BASE = 'https://cheesy-subject-tightness.ngrok-free.dev';

/**
 * A central API client that handles authentication, tunneling bypass, and JSON content types.
 * This replaces the need for a global window.fetch interceptor.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  
  // Inject ngrok bypass header for the tunnel
  headers.set('ngrok-skip-browser-warning', 'true');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Ensure session cookies are sent for all requests
  });

  return response;
}
