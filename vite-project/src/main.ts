import './style.css'

const api = async () => {
  const res = await fetch("https://www.bortakvall.se/api/");
  if (!res.ok) {
    throw new Error(`Could not fetch candy, because ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

api

