// Query selectors for functionality of modal box 
const modal = document.querySelector(".modal"); // En query selector på sectiontaggen i HTML dokumentet som ska innehålla Modalen
const overlay = document.querySelector(".overlay"); // En query selector på en div som ska innehålla overlayen som blurrar bakgrunden
const closeModalBtn = document.querySelector(".btn-close"); // En query selector på knappen som ska stänga Modal boxen
const modalInfo = document.querySelector(".infoCandy");
let candyImg = document.createElement("img");
//queryselector for shoppingcart
let shoppingCart = document.querySelector(".cart");
const cartSum = document.querySelector("#sum");
const cartCount = document.querySelector("#count");
const candyTot = document.querySelector(".order");
const addButton = document.querySelector(".btn plus");
const removeButton = document.querySelector(".btn minus");

// Base URL and endpoint from where we fetch the candy
const baseUrl = 'https://www.bortakvall.se';

// Array to store data from API
let products = [];

// Call getApi and render names and images to DOM 
const getApi = async () => {

    // Variable to store awaited URL with products
    let data = await fetchApi('/api/products');
    console.log('data:', data);

    products = data;

    renderApi();
};

// Promise for baseUrl and changeable endPoint
const fetchApi = async (endPoint) => {

    const res = await fetch(baseUrl + endPoint);

    // If fetch not succeeds throw error
    if (!res.ok) {
        throw new Error(`This did not work: ${res.status} ${res.statusText}`)
    };

    return await res.json();
};

// Render product name and image to DOM via map-function
const renderApi = () => {

    //console.log('Render API', products)

    products.data.map(e => {
        return document.querySelector('.row').innerHTML +=
            `<div class="col-3">
        <img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy">
        <h3>${e.name} ${e.price}kr</h3>
        <button type="button" id="${e.id}" class="cart btn btn-success">Add to cart</button> 
        <button type="button" id="${e.id}" class="info btn btn-info">Info</button>
        </div>`
    });
};

// Catch if returned error from promise and call getApi-function
getApi()
    .then(
        console.log('Success!')
    )
    .catch(error => console.log('rejected: ', error.message));

//console.log('PRODUCTS: ', products)


// Query selectors for functionality of Info button 
let containerEl = document.querySelector('.row');

// Query Selector for Add to Cart button
let shoppingcartCandy = [];

// Query Selector for button and adding event listener 
containerEl.addEventListener('click', e => {
    if (e.target.tagName == 'BUTTON') {

        // If adding another button in containerEl add includes('.info') to else
        e.target.className.includes('cart') ? addToCart(e.target.id) : getInfo(e.target.id);

    };
});



// Function w/ module that pops up on click
const getInfo = e => {



    console.log(`you clicked info of product w/ ID: ${e}`);

    // Find products via ID to show info
    const infoCandy = products.data.find(candy => candy.id == e);

    // Opens module box
    openModal();

    // Rendering candy name + price + description to DOM
    modalInfo.innerHTML = `${infoCandy.name} - ${infoCandy.price} kr ${infoCandy.description}`;

    // Setting src to large image to render to DOM
    candyImg.src = `${baseUrl}${infoCandy.images.large}`;
    modalInfo.appendChild(candyImg);
    candyImg.alt = `picture of ${infoCandy.name} candy`;
    //    modalInfo.innerHTML += (`<button type="button" id="(${infoCandy.id})" class="btn btn-success">Add to cart</button>`); // Add cart to modual REMOVE?!  
};




// Functions for modalbox 
const openModal = () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};
const closeModal = () => {
    modal.classList.add("hidden");  // Byt .add till toggle och testa 
    overlay.classList.add("hidden"); // Byt .add till toggle och testa 
};

// Eventlisteners for modalbox 
// close the modal when the close button and overlay is clicked

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    };
});








// Function for Add to Cart button
let count = 0;              //hur många varor det är TOTALT
let sum = 0;                //summa TOTALT
let cart = {};              //objekt i carten




const addToCart = e => {
    // Find clicked candy object from products
    let candy = products.data.find(candy => candy.id == e);

    let price = candy.price;
    let title = candy.name;
    let id = candy.id;

    console.log(price);

    // Pushing candy to shoppingcartCandy & adding quantity to candy array to store the amount of each candy
    if (!shoppingcartCandy.includes(candy)) {
        shoppingcartCandy.push(candy)
        candy.qty = 1;
    } else {
        candy.qty++;
    };

    console.log('Shopping cart contains: ', shoppingcartCandy);

    count++;
    sum += candy.price;

    const storage = JSON.stringify(shoppingcartCandy); // skapar variabel som store:ar klickade godisar
    localStorage.setItem("candyInCart", storage);

    //eventlistener for shoppingcart when icon clicked
    shoppingCart.addEventListener('click', () => {
        localStorage.getItem(storage); //läggs i kundvagnen

    });

    console.log('Storage: ', storage);

    console.log('Sum & count: ', sum, count);

    cartSum.innerHTML = `<p>Summa: ${sum} kr</p>`;
    cartCount.innerHTML = `<p>Antal: ${count} st</p>`;

    /*localStorage.setItem("sum", sum);
    localStorage.setItem("count", count); */

    // Empty then render to DOM
    candyTot.innerHTML = '';

    //what is in the cart
    shoppingcartCandy.map(e => candyTot.innerHTML += 
        `<td>${e.name}</td> <td>${e.price * e.qty}kr</td> <td>${e.qty}st
        <button type="button" id="${e.id}" class="btn-plus">+</button> 
        <button type="button" id="${e.id}" class="btn-minus">-</button></td><br>`);



    // adding event listener 
    candyTot.addEventListener('click', e => {
    if (e.target.tagName == 'BUTTON') {

        if (e.target.className.includes('plus')) {
            console.log('du la till');
        } if (e.target.className.includes('minus')) {
            console.log('du tog bort');
        }
        

    };
});

}