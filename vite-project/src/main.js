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
const baseUrl = 'https://www.bortakvall.se';

// Array to store data from API
let products = [];

// Promise for baseUrl and changeable endPoint
const fetchApi = async (endPoint) => {
    const res = await fetch(baseUrl + endPoint);

    // If fetch not succeeds throw error
    if (!res.ok) {
        throw new Error(`Något gick fel: ${res.status} ${res.statusText}`)
    };
    return await res.json();
};

// Call getApi and render names and images to DOM 
const getApi = async () => {
    try {

        // Variable to store awaited URL with products
        const data = await fetchApi('/api/products');

        products = data;

    } catch (err) {
        submitMsg(err)
        return;
    }
    renderApi();
};

// Render product name and image to DOM via map-function
const renderApi = () => {

    products.data.sort((a, b) => a.name > b.name ? 1 : -1);

    const instock = products.data.filter(e => e.stock_status == "instock").length;
    const stockTot = products.data.length;

    productStock.innerHTML += `<p>Visar ${stockTot} produkter varav ${instock} är i lager.</p>`;

    products.data.map(e => {
        if (e.stock_status == "outofstock") {
            containerEl.innerHTML +=
                `<div class="col-3">
        <img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy">
        <h3>${e.name} ${e.price}kr,<br>Slut i lager</h3>
        <button type="button" id="${e.id}" class="cart btn btn-danger" disabled aria-disabled="true">Lägg i kundvagn</button> 
        <button type="button" id="${e.id}" class="info btn btn-info">Info</button>
        </div>`
        } else {
            containerEl.innerHTML +=
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

let clickedBtn;

// Deciding what will happen depending on which button clicked
containerEl.addEventListener('click', e => {
    if (e.target.tagName == 'BUTTON') {
        clickedBtn = e.target;
        e.target.className.includes('cart') ? addToCart(e.target.id) : getInfo(e.target.id);
    };
});

// Function w/ module that pops up on click
const getInfo = e => {

    // Find products via ID to show info
    const infoCandy = products.data.find(candy => candy.id == e);

    openModal();

    // Rendering candy name + price + description to DOM
    modalInfo.innerHTML = `${infoCandy.name} - ${infoCandy.price} kr ${infoCandy.description}`;

    // Setting src to large image to render to DOM
    candyImg.src = `${baseUrl}${infoCandy.images.large}`;
    modalInfo.appendChild(candyImg);
    candyImg.alt = `picture of ${infoCandy.name} candy`;
};

// Functions for modalbox 
const openModal = () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};
const closeModal = () => {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// Eventlisteners for modalbox 
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    };
});

// Getting candyInCart value from local storage
const shoppingcartCandy = JSON.parse(localStorage.getItem('candyInCart')) ?? [];

let count;
let sum;

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

const addToCart = e => {

    // Find clicked candy object from products
    let candy = products.data.find(candy => candy.id == e);

    // Create temporary array to push object IDs from shoppingcartCandy to new candyIds array
    const candyIds = [];

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

    cartSum.innerHTML = `<p>Summa: ${sum} kr</p>`;
    cartCount.innerHTML = `<p>Antal: ${count} st</p>`;

    renderCart();
};

cartItems.addEventListener('click', f => {
    if (f.target.className == 'btn-plus' || 'btn-minus' || 'btnRemove') {
        let removeCandy = null;
        shoppingcartCandy.forEach(e => {

            if (f.target.id == e.id) {
                if (f.target.className.includes('plus') && e.stock_quantity != e.qty) {
                    e.qty++;

                } else if (f.target.className.includes('minus')) {
                    e.qty--;

                    if (e.qty <= 0) {
                        removeCandy = e.id;
                    };

                } else if (f.target.className.includes('btnRemove')) {
                    e.qty = 0;
                    if (e.qty <= 0) {
                        removeCandy = e.id;
                    };
                };
            };
        });

        if (removeCandy) {
            if (shoppingcartCandy.length < 1) {
                localStorage.clear('candyInCart');
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
    cartItems.innerHTML = '';
    shoppingcartCandy.map(e => cartItems.innerHTML += `<li>${e.qty}st ${e.name} för ${e.price * e.qty}kr <button type="button" id="${e.id}" class="btn-plus  btn btn-outline-secondary"> + </button> 
    <button type="button" id="${e.id}" class="btn-minus btn btn-outline-secondary"> - </button></li> <button type="button" id="${e.id}" class="btnRemove btn btn-outline-secondary">Ta bort</button>`);
    cartItems.innerHTML += `<p>Antal: ${count} st</p><p>Summa: ${sum} kr</p>`;
};

// Eventlistener for shoppingcart when icon clicked
shoppingCart.addEventListener('click', () => {
    openCartModal();
});

const openCartModal = () => {
    cartModal.classList.remove("hidden");
    renderCart();
};

const closeCartModal = () => {
    cartModal.classList.add("hidden");
    overlay.classList.add("hidden");
};

closeCartModalBtn.addEventListener("click", closeCartModal);
overlay.addEventListener("click", closeCartModal);

// Close modal when the Esc key is pressed
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !cartModal.classList.contains("hidden")) {
        closeCartModal();
    };
});



const orderView = () => {
    containerEl.classList.toggle("hidden");
    closeModal();
    closeCartModal();
    orderForm.classList.toggle("hidden");
    shoppingCart.classList.add("hidden");
    productStock.classList.add("hidden");
    // topArrow.classList.add("hidden");
};

orderBtn.addEventListener('click', orderView);

const submitMsg = (msg) => {
    orderForm.classList.add("hidden");
    orderRes.classList.remove("hidden");
    topArrow.innerHTML = "";
    // topArrow.classList.add("hidden");
    orderRes.innerHTML += msg
    orderRes.innerHTML += `<br><button type="button" class="homeBtn btn btn-outline-secondary">Hem</button>`;
    document.querySelector(".homeBtn").addEventListener('click', () => document.location.href = "/")
};

const backToHomepage = () => {
    orderForm.classList.add("hidden");
    containerEl.classList.toggle("hidden");
    orderRes.classList.add("hidden");
    shoppingCart.classList.remove("hidden");
    productStock.classList.remove("hidden");
}

backBtn.addEventListener("click", backToHomepage);

// Finding all input fields from order form
const firstName = document.querySelector("#fname");
const lastName = document.querySelector("#lname");
const address = document.querySelector("#address");
const zipCode = document.querySelector("#zipcode");
const city = document.querySelector("#city");
const email = document.querySelector("#email");
const telephone = document.querySelector("#telephone");

let submitData = {};

const submitOrder = async () => {

    let shoppingCartItems = await shoppingcartCandy.map(e => {
        return { product_id: e.id, qty: e.qty, item_price: e.price, item_total: e.price * e.qty }
    });

    // Values from customer input fields to add to POST body
    submitData = {
        customer_first_name: firstName.value,
        customer_last_name: lastName.value,
        customer_address: address.value,
        customer_postcode: zipCode.value,
        customer_city: city.value,
        customer_email: email.value,
        customer_phone: telephone.value,
        order_total: sum,
        order_items: shoppingCartItems
    };

    // POST request
    const res = await fetch('https://www.bortakvall.se/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
    });

    if (!res.ok) {
        throw new Error(`Could not place order, because of error: ${res.status}`);
    };

    return await res.json()
};

// When submit button is clicked by the customer
orderForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    let orderData = [];

    try {

        orderData = await submitOrder();
        const submitErrors = Object.values(orderData.data)

        if (orderData.status == 'fail') {

            // Calling function which renders respons to DOM
            submitMsg(submitErrors);

            // Return if error is found, preventing rest of code to run
            return;
        };
    } catch (err) {
        submitMsg(err);

        // Return if error is found, preventing rest of code to run
        return;
    };

    const orderConfirmation =
        `<p>Tack för din order, ${submitData.customer_first_name}!<br>Ditt ordernummer är: ${orderData.data.id}</p>`;

    // Store contact information from previous order in local storage
    localStorage.setItem('customerInfo', JSON.stringify(submitData));

    // Remove local storage cart
    localStorage.removeItem('candyInCart');

    submitMsg(orderConfirmation);
});

// Retrive customerInfo to pre fill form values 
const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));

// Getting submit values and setting them to form input when empty
const submitValues = Object.values(customerInfo ?? []);

firstName.value = submitValues[0] ?? ''
lastName.value = submitValues[1] ?? ''
address.value = submitValues[2] ?? ''
zipCode.value = submitValues[3] ?? ''
city.value = submitValues[4] ?? ''
email.value = submitValues[5] ?? ''
telephone.value = submitValues[6] ?? ''