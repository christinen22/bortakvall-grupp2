// Base URL and endpoint from where we fetch the candy

const baseUrl = 'https://www.bortakvall.se';
// let endPoint = '';

const fetchApi = async (endPoint) => {

    const res = await fetch(baseUrl + endPoint);

    if (!res.ok) {
        throw new Error(`This did not work: ${res.status} ${res.statusText}`)
    };

    return await res.json();
};

// Not needed because async below (w/ then)? 

const renderApi = async () => {

    // Not needed because async above? 

    // const data = await fetchApi()
    //     .then(data => console.log('resolved: ', data))
    //     .catch(error => console.log('rejected: ', error.message));

    const data = await fetchApi('/api/products');
    console.log('data:', data);

    // const image = await fetchApi(data.data)

    // Render product name and image to DOM

    data.data.map(e => {
        return document.querySelector('#app').innerHTML +=
            `<h3>${e.name}</h3><img src="${baseUrl}${e.images.large}" alt="picture of ${e.name} candy">`
    });
}

renderApi()
    .catch(error => console.log('rejected: ', error.message));


