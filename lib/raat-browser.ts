export async function raatRequest(
  action: string,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers)

  if (
    typeof init.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(
    `/api/raat?action=${encodeURIComponent(action)}`,
    {
      ...init,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
    }
  )

  let result

  try {
    result = await response.json()
  } catch {
    throw new Error('The server returned an unexpected response.')
  }

  if (!response.ok) {
    if (response.status === 401 && action !== 'register') {
      window.location.assign('/admin-login')
      throw new Error('Please sign in as admin.')
    }

    throw new Error(result.error || 'Request failed.')
  }

  return result
}