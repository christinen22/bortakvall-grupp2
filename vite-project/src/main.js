const baseUrl = 'https://www.bortakvall.se/api/';
const endPoint = '';

const fetchApi = async (e) => {

    // const baseUrl = 'https://www.bortakvall.se/api/';
    // const endPoint = `products`;

    const res = await fetch(baseUrl + endPoint);

    if (!res.ok) {
        throw new Error(`This did not work: ${res.status} ${res.statusText}`)
    };

    const data = await res.json();

    return data;
};

fetchApi()
    .then(data => console.log('resolved: ', data))
    .catch(error => console.log('rejected: ', error.message));

const renderApi = async () => {
    let data = await fetchApi()
    console.log('hej:', data.data)
    data.data.map((e) => {
        return document.querySelector('#app').innerHTML += `<p>${e.name}</p><img src="${e.images}">`
    });
};

renderApi()


