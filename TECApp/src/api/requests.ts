const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL


export async function getDefaultValues() {
  const url = `/defaults`
  const response = await fetch(BASE_URL + url, { method: 'GET' })
  return await response.json()
}

export async function getMinMaxValues() {
  const response = await fetch(BASE_URL + '/minmax', { method: 'GET' })
  return await response.json()
}
