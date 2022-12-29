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
//queryselector to open cartModal
const cartModal = document.querySelector(".cartModal");
const closeCartModalBtn = document.querySelector(".btn-close-cart");
let cartItems = document.querySelector(".cartItems");
const orderBtn = document.querySelector(".orderBtn");
const orderForm = document.querySelector(".form");


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

    products.data.sort((a, b) => {
        return a.name > b.name
        ? 1
        : -1
    }) 
    
    console.log(products);
    
    //console.log('Render API', products)

    products.data.map(e => {

        return containerEl.innerHTML +=
            `<div class="col-3">
        <img src="${baseUrl}${e.images.thumbnail}" alt="picture of ${e.name} candy">
        <h3>${e.name} ${e.price}kr, <br> ${e.stock_quantity} st i lager.</h3>
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
let containerEl = document.querySelector('.candyProducts');

// // Query Selector for Add to Cart button
// let shoppingcartCandy = [];

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


// Getting candyInCart value from local storage
const shoppingcartCandy = JSON.parse(localStorage.getItem('candyInCart')) ?? [];
console.log('candy in cart: ', shoppingcartCandy)

// Empty then render to DOM
candyTot.innerHTML = '';

const addToCart = e => {

    // Find clicked candy object from products
    let candy = products.data.find(candy => candy.id == e);

    console.log('shoppingcartCandy i addtocart: ', shoppingcartCandy, candy)

    // Create temporary array to push object IDs from shoppingcartCandy to new candyIds array
    const candyIds = [];

    shoppingcartCandy.map(f => {
        candyIds.push(f.id);
    });

    console.log(candyIds);

    // Pushing candy to shoppingcartCandy & adding quantity to candy array to store the amount of each candy 
    if (!candyIds.includes(candy.id)) {

        shoppingcartCandy.push(candy)
        candy.qty = 1;

    } else {

        shoppingcartCandy.map(e => {
            if (candy.id == e.id) {
                e.qty++;
            }
        });

    };

    console.log('Shopping cart contains: ', shoppingcartCandy);

    console.log('Sum & count: ', sum, count);

    console.log(shoppingcartCandy);

    cartSave();

};



const cartSave = () => {

    const storage = JSON.stringify(shoppingcartCandy); // skapar variabel som store:ar klickade godisar
    localStorage.setItem('candyInCart', storage);

    // let count = shoppingcartCandy.map(e => {
    //     return e.qty
    // });

    // console.log('Totalt amount: ', count)

    // let sum = shoppingcartCandy.map(e => {
    //     return e.price * e.qty
    // });

    console.log('Totalt cost: ', sum)

    cartSum.innerHTML = `<p>Summa: ${sum} kr</p>`;
    cartCount.innerHTML = `<p>Antal: ${count} st</p>`;

    // Empty then render to DOM
    candyTot.innerHTML = '';

    cartItems.innerHTML = '';

    // if (shoppingcartCandy) {
    shoppingcartCandy.map(e =>
        candyTot.innerHTML += `<td>${e.name}</td> <td>${e.price * e.qty}kr</td> <td>${e.qty}st
            <button type="button" id="${e.id}" class="btn-plus">+</button> 
                <button type="button" id="${e.id}" class="btn-minus">-</button></td><br>`);
    shoppingcartCandy.map(e => cartItems.innerHTML += `<li>${e.qty}st ${e.name} för ${e.price * e.qty}kr</li>`);
    // }
};

//eventlistener for shoppingcart when icon clicked
shoppingCart.addEventListener('click', () => {
    openCartModal();
    console.log('clicked carticon');
    //localStorage.getItem(storage); //läggs i kundvagnen

});

const openCartModal = () => {
    cartModal.classList.remove("hidden");
    cartItems.innerHTML = '';
    shoppingcartCandy.map(e => cartItems.innerHTML += `<li>${e.qty}st ${e.name} för ${e.price * e.qty}kr</li>`);
    //overlay.classList.remove("hidden");
};
const closeCartModal = () => {
    cartModal.classList.add("hidden");  // Byt .add till toggle och testa 
    overlay.classList.add("hidden"); // Byt .add till toggle och testa 
};

closeCartModalBtn.addEventListener("click", closeCartModal);
overlay.addEventListener("click", closeCartModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !cartModal.classList.contains("hidden")) {
        closeCartModal();
    };
});



const orderView = () => {
    console.log('you clicked order');
    containerEl.classList.toggle("hidden");
    closeModal();
    closeCartModal();
    orderForm.classList.toggle("hidden");
}
orderBtn.addEventListener('click', orderView);

const alertSubmit = () => {
    alert('Thank you for your order!');
    localStorage.clear('candyInCart'); // funkar med click men ej med submit
}
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alertSubmit();
});




// adding event listener 
candyTot.addEventListener('click', e => {
    if (e.target.tagName == 'BUTTON') {

        if (e.target.className.includes('plus')) {
            console.log('you added')

            e.qty++;
        } else if (e.target.className.includes('minus')) {
            console.log('you removed');
            e.qty--;
        };

        console.log(e.qty);
    }
})



