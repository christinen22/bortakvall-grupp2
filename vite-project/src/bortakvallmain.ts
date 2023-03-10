import './style.css'
import { baseUrl, fetchApi, submitOrder, submitData } from './bortakvallapi'
import { IShoppingcartCandy } from './interfaces'


// Query selectors for functionality of modal box 
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");
const modalInfo = document.querySelector(".infoCandy");
let candyImg = document.createElement("img");

//queryselector for shoppingcart
let shoppingCart = document.querySelector(".cart");
const cartSum = document.querySelector("#sum");
const cartCount = document.querySelector("#count");

//queryselector to open cartModal
const cartModal = document.querySelector(".cartModal");
const closeCartModalBtn = document.querySelector(".btn-close-cart");
let cartItems = document.querySelector(".cartItems");
const orderBtn = document.querySelector(".orderBtn");
const orderForm = document.querySelector(".form");
const orderRes = document.querySelector(".orderRes");
const backBtn = document.querySelector("#backbtn");
const productStock = document.querySelector(".prodStock");
const topArrow = document.querySelector(".goToTop");

// Base URL and endpoint from where we fetch the candy
//const baseUrl = 'https://www.bortakvall.se';

// Array to store data from API
let products: any = [];                 //GÖR EV INTERFACE


// Call getApi and render names and images to DOM 
const getApi = async () => {
    try {

        // Variable to store awaited URL with products
        const data = await fetchApi('/api/products');

        products = data;

    } catch (err: any) {
        submitMsg(err)
        return;
    }
    renderApi();
};

// Render product name and image to DOM via map-function
const renderApi = () => {

    products.data.sort((a: any, b: any) => a.name > b.name ? 1 : -1);

    const instock = products.data.filter((e: any) => e.stock_status == "instock").length;
    const stockTot = products.data.length;

    productStock!.innerHTML += `<p>Visar ${stockTot} produkter varav ${instock} är i lager.</p>`;

    products.data.map((e: any) => {
        if (e.stock_status == "outofstock") {
            containerEl!.innerHTML +=
                `<div class="col-3">
        <img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy">
        <h3>${e.name} ${e.price}kr,<br>Slut i lager</h3>
        <button type="button" id="${e.id}" class="cart btn btn-danger" disabled aria-disabled="true">Lägg i kundvagn</button> 
        <button type="button" id="${e.id}" class="info btn btn-info">Info</button>
        </div>`
        } else {
            containerEl!.innerHTML +=
                `<div class="col-3">
        <img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy">
        <h3>${e.name} ${e.price}kr, <br> ${e.stock_quantity} st i lager.</h3>
        <button type="button" id="${e.id}" class="cart btn btn-success">Lägg i kundvagn</button> 
        <button type="button" id="${e.id}" class="info btn btn-info">Info</button>
        </div>`
        };
    });
};

// Call API and render to DOM
getApi()

// Query selectors for functionality of Info button 
let containerEl = document.querySelector('.candyProducts');


// Deciding what will happen depending on which button clicked
containerEl!.addEventListener('click', e => {
    if ((e.target as HTMLButtonElement).tagName == 'BUTTON') {
        (e.target as HTMLButtonElement).className.includes('cart') ? addToCart((e.target as HTMLButtonElement).id) : getInfo((e.target as HTMLButtonElement).id);
    };
});

// Function w/ module that pops up on click
const getInfo = (e: string) => {


    // Find products via ID to show info
    const infoCandy = products.data.find((candy: any) => candy.id == e);

    openModal();

    // Rendering candy name + price + description to DOM
    modalInfo!.innerHTML = `${infoCandy.name} - ${infoCandy.price} kr ${infoCandy.description}`;

    // Setting src to large image to render to DOM
    candyImg.src = `${baseUrl}${infoCandy.images.large}`;
    modalInfo!.appendChild(candyImg);
    candyImg.alt = `picture of ${infoCandy.name} candy`;
};

// Functions for modalbox 
const openModal = () => {
    modal!.classList.remove("hidden");
    overlay!.classList.remove("hidden");
};
const closeModal = () => {
    modal!.classList.add("hidden");
    overlay!.classList.add("hidden");
};

// Eventlisteners for modalbox 
closeModalBtn!.addEventListener("click", closeModal);
overlay!.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal!.classList.contains("hidden")) {
        closeModal();
    };
});

// Getting candyInCart value from local storage
export const shoppingcartCandy: IShoppingcartCandy [] = JSON.parse(localStorage.getItem('candyInCart')!) ?? [];

let count: number;
export let sum: number;

const setSumCount = () => {

    const storage = JSON.stringify(shoppingcartCandy);
    localStorage.setItem('candyInCart', storage);

    if (shoppingcartCandy.length >= 1) {
        count = shoppingcartCandy
            .map(e => e.qty)
            .reduce((acc, curr) => acc + curr);
        sum = shoppingcartCandy
            .map(e => e.price * e.qty)
            .reduce((acc, curr) => acc + curr);
    } else {
        count = 0;
        sum = 0;
    };
};

setSumCount();

const addToCart = (e: any) => {          

    // Find clicked candy object from products
    let candy = products.data.find((candy: any) => candy.id == e);

    // Create temporary array to push object IDs from shoppingcartCandy to new candyIds array
    const candyIds: any = [];            
    shoppingcartCandy.map(f => candyIds.push(f.id));

    // Pushing candy to shoppingcartCandy & adding quantity to candy array to store the amount of each candy 
    if (!candyIds.includes(candy.id)) {
        shoppingcartCandy.push(candy)
        candy.qty = 1;
    } else {

        shoppingcartCandy.map(e => {
            if (candy.id == e.id && e.qty != candy.stock_quantity) {
                e.qty++;
            };
        });
    };

    cartSave();
};

const cartSave = () => {

    setSumCount();

    cartSum!.innerHTML = `<p>Summa: ${sum} kr</p>`;
    cartCount!.innerHTML = `<p>Antal: ${count} st</p>`;

    renderCart();
};

cartItems!.addEventListener('click', f => {
    if ((f.target as HTMLButtonElement).className == 'btn-plus' || 'btn-minus' || 'btnRemove') {
        let removeCandy = null;
        shoppingcartCandy.forEach(e => {

            if ((f.target as HTMLButtonElement).id == String(e.id)) {
                if ((f.target as HTMLButtonElement).className.includes('plus') && e.stock_quantity != e.qty) {
                    e.qty++;

                } else if ((f.target as HTMLButtonElement).className.includes('minus')) {
                    e.qty--;

                    if (e.qty <= 0) {
                        removeCandy = e.id;
                    };

                } else if ((f.target as HTMLButtonElement).className.includes('btnRemove')) {
                    e.qty = 0;
                    if (e.qty <= 0) {
                        removeCandy = e.id;
                    };
                };
            };
        });

        if (removeCandy) {
            if (shoppingcartCandy.length < 1) {
                localStorage.removeItem('candyInCart');
            } else {
                for (let i = 0; i < shoppingcartCandy.length; i++) {
                    if (shoppingcartCandy[i].id == removeCandy) {
                        shoppingcartCandy.splice(i, 1);
                        break;
                    };
                };
            };
        };
        cartSave();
    };
});

// Cart modal text as function
const renderCart = () => {
    cartItems!.innerHTML = '';
    shoppingcartCandy.map(e => cartItems!.innerHTML += `<li>${e.qty}st ${e.name} för ${e.price * e.qty}kr <button type="button" id="${e.id}" class="btn-plus  btn btn-outline-secondary"> + </button> 
    <button type="button" id="${e.id}" class="btn-minus btn btn-outline-secondary"> - </button></li> <button type="button" id="${e.id}" class="btnRemove btn btn-outline-secondary">Ta bort</button>`);
    cartItems!.innerHTML += `<p>Antal: ${count} st</p><p>Summa: ${sum} kr</p>`;
};

// Eventlistener for shoppingcart when icon clicked
shoppingCart!.addEventListener('click', () => {
    openCartModal();
});

const openCartModal = () => {
    cartModal!.classList.remove("hidden");
    renderCart();
};

const closeCartModal = () => {
    cartModal!.classList.add("hidden");
    overlay!.classList.add("hidden");
};

closeCartModalBtn!.addEventListener("click", closeCartModal);
overlay!.addEventListener("click", closeCartModal);

// Close modal when the Esc key is pressed
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !cartModal!.classList.contains("hidden")) {
        closeCartModal();
    };
});


const orderView = () => {
    containerEl!.classList.toggle("hidden");
    closeModal();
    closeCartModal();
    orderForm!.classList.toggle("hidden");
    shoppingCart!.classList.add("hidden");
    productStock!.classList.add("hidden");
};

orderBtn!.addEventListener('click', orderView);

const submitMsg = (msg: string) => {
    orderForm!.classList.add("hidden");
    orderRes!.classList.remove("hidden");
    topArrow!.innerHTML = "";
    orderRes!.innerHTML += msg
    orderRes!.innerHTML += `<br><button type="button" class="homeBtn btn btn-outline-secondary">Hem</button>`;
    document.querySelector(".homeBtn")!.addEventListener('click', () => document.location.href = "/")
};

const backToHomepage = () => {
    orderForm!.classList.add("hidden");
    containerEl!.classList.toggle("hidden");
    orderRes!.classList.add("hidden");
    shoppingCart!.classList.remove("hidden");
    productStock!.classList.remove("hidden");
}

backBtn!.addEventListener("click", backToHomepage);


// Finding all input fields from order form
export const firstName: any = document.querySelector("#fname");
export const lastName: any = document.querySelector("#lname");
export const address: any = document.querySelector("#address");
export const zipCode: any = document.querySelector("#zipcode");
export const city: any = document.querySelector("#city");
export const email: any = document.querySelector("#email");
export const telephone: any = document.querySelector("#telephone");


// When submit button is clicked by the customer
orderForm!.addEventListener('submit', async (e) => {

    e.preventDefault();
    (document.querySelector('#submitbtn') as HTMLButtonElement).disabled = true;

    let orderData = [];

    try {

        orderData = await submitOrder();
        const submitErrors: any = Object.values(orderData.data)         //INTERRFACE

        if (orderData.status == 'fail') {

            // Calling function which renders respons to DOM
            submitMsg(submitErrors);

            // Return if error is found, preventing rest of code to run
            return;
        };
    } catch (err: any) {
        submitMsg(err);

        // Return if error is found, preventing rest of code to run
        return;
    };

    const orderConfirmation =
        `<p>Tack för din order, ${submitData.customer_first_name}!<br>Ditt ordernummer är: ${orderData.data.id}</p>`;     //INTERFACE 

    // Store contact information from previous order in local storage
    localStorage.setItem('customerInfo', JSON.stringify(submitData));

    // Remove local storage cart
    localStorage.removeItem('candyInCart');

    submitMsg(orderConfirmation);
});

// Retrive customerInfo to pre fill form values 
const customerInfo = JSON.parse(localStorage.getItem('customerInfo')!);

// Getting submit values and setting them to form input when empty
const submitValues = Object.values(customerInfo ?? []);

firstName!.value = submitValues[0] ?? ''
lastName!.value = submitValues[1] ?? ''
address!.value = submitValues[2] ?? ''
zipCode!.value = submitValues[3] ?? ''
city!.value = submitValues[4] ?? ''
email!.value = submitValues[5] ?? ''
telephone!.value = submitValues[6] ?? ''