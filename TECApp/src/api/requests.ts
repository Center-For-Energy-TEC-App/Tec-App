const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

type DefaultValuesRequest = {
  global_tw?: string
}

export async function getDefaultValues(request: DefaultValuesRequest) {
  const params = new URLSearchParams(request)
  const url = `/defaults?${params.toString()}`

  const response = await fetch(BASE_URL + url, { method: 'GET' })
  return await response.json()
}

export async function getMinMaxValues() {
  const response = await fetch(BASE_URL + '/minmax', { method: 'GET' })
  return await response.json()
}
