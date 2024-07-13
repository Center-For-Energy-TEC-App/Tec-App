const url = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function getAll(){
    const response = await fetch(url, {method: "GET"});
    return await response.text();
}