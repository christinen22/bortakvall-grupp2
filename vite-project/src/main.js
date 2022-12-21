// Base URL and endpoint from where we fetch the candy

const baseUrl = 'https://www.bortakvall.se';

// Promise for baseUrl and changeable endPoint

const fetchApi = async (endPoint) => {

    const res = await fetch(baseUrl + endPoint);

    // If fetch not succeeds throw error

    if (!res.ok) {
        throw new Error(`This did not work: ${res.status} ${res.statusText}`)
    };

    return await res.json();
};

// Call fetchApi and render names and images to DOM 

const renderApi = async () => {

    // Variable to store awaited URL with products

    let data = await fetchApi('/api/products');
    console.log('data:', data);

    // Render product name and image to DOM via map-function

    data.data.map(e => {
        return document.querySelector('#app').innerHTML +=
            `<img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy"><h3>${e.name}</h3>`
    });
};

// Catch if returned error from promise and call renderApi-function

renderApi()
    .catch(error => console.log('rejected: ', error.message));


