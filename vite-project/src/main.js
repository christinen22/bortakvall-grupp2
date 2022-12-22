// Base URL and endpoint from where we fetch the candy

const baseUrl = 'https://www.bortakvall.se';

// Array to store data from API
let data = [];

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

    data = await fetchApi('/api/products');
    console.log('data:', data);

    // Render product name and image to DOM via map-function

    data.data.map(e => {
        return document.querySelector('.row').innerHTML +=
            `<div class="col-3">
            <img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy">
            <h3>${e.name} ${e.price}kr</h3>
            <button type="button" id="${e.id}" class="cart btn btn-success">Add to cart</button> 
            <button type="button" id="${e.id}" class="info btn btn-info">Info</button>
            </div>`
    });
};

// Catch if returned error from promise and call renderApi-function

renderApi()
    .then(() => { console.log('DATA: ', data.data) })
    .catch(error => console.log('rejected: ', error.message));


// Query selectors for functionality of modal box 
const modal = document.querySelector(".modal"); // En query selector på sectiontaggen i HTML dokumentet som ska innehålla Modalen
const overlay = document.querySelector(".overlay"); // En query selector på en div som ska innehålla overlayen som blurrar bakgrunden
const closeModalBtn = document.querySelector(".btn-close"); // En query selector på knappen som ska stänga Modal boxen
const modalInfo = document.querySelector(".infoCandy");
let candyImg = document.createElement("img");

// Query selectors for functionality of Info button 
let containerEl = document.querySelector('.row');

// Query Selector for Add to Cart button
let shoppingcartCandy = [];

// Query Selector for button and adding event listener 
containerEl.addEventListener('click', e => {
    if (e.target.className.includes('cart')) {
        console.log('ID:t', e.target)
        addToCart(e.target.id)

    } if (e.target.className.includes('info')) {
        // getInfo(e.target.id)
        console.log('ID:t', e.target.id)
    }
    console.log('"e":t: ', e.target)
});


// Function for Add to Cart button
const addToCart = e => {
    console.log(`you clicked product w/ ID: ${e}`);
    // const foundCandy = e.find((e) => {
    //     return e === e.id
    // }); // skapar nya variabel där man sätter variabeln till objectet som tillhör det specifika ID:et som klickades

    // console.log(foundCandy);

    shoppingcartCandy.push(e); // pushar det klickade godiset till en tom array som vi sedan kommer lägga till kundkorgen

    console.log('Shopping cart contains: ', shoppingcartCandy); // konsoll loggar "kundkorgen"
};


// Function for pop up Info
// function getInfo(e) {
//     console.log(`you clicked info of product ${e}`);
//     const infoCandy = data.data.find(candy => candy.id === e); // skapar ny variabel med objectet vars info-knapp klickas på.
//     openModal(); // öppnar modalboxen
//     modalInfo.innerHTML = (`${infoCandy.name} - ${infoCandy.price} kr`); //Placerar godisets namn & pris i modalen
//     modalInfo.innerHTML += (`${infoCandy.description}`); //Placerar godisets beskrivning i modalen
//     candyImg.src = (`${baseUrl}${infoCandy.images.large}`); // hämtar den stora bilden från objectet för tillhörande godis
//     modalInfo.appendChild(candyImg); // renderar ut bilden i modalen
// //    modalInfo.innerHTML += (`<button type="button" id="(${infoCandy.id})" class="btn btn-success">Add to cart</button>`); // Add cart to modual REMOVE?!  
// }





// INFO BOX APPEAR / DISAPPEAR //

// Functions for modalbox 
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};
const closeModal = function () {
    modal.classList.add("hidden");  // Byt .add till toggle och testa 
    overlay.classList.add("hidden"); // Byt .add till toggle och testa 
};

// Eventlisteners for modalbox 
// close the modal when the close button and overlay is clicked

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});








