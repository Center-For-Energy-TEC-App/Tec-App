const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

type DefaultValuesRequest = {
  category: "2024" | "bau" | "altered"
  region: string,
  global_tw: string,
}


export async function getDefaultValues(request: DefaultValuesRequest) {
  const params = new URLSearchParams(request)
  const url = `/defaults?${params.toString()}`

  const response = await fetch(BASE_URL+url, { method: 'GET' })
  return await response.json()
}
