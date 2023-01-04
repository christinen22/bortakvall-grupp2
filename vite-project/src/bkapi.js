// Base URL and endpoint from where we fetch the candy
const baseUrl = 'https://www.bortakvall.se';


// Promise for baseUrl and changeable endPoint
const fetchApi = async (endPoint) => {
    const res = await fetch(baseUrl + endPoint);

    // If fetch not succeeds throw error
    if (!res.ok) {
        throw new Error(`Något gick fel: ${res.status} ${res.statusText}`)
    };
    return await res.json();
};

