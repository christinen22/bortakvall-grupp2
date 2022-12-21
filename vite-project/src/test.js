let candy = []; // En tom array som ska innehålla det hämtade godiset från API:et 
let containerEl = document.querySelector('.row'); // En query selector på diven med class row i HTML dokumentet
let shoppingcartCandy = []; // En tom array som ska innehålla det valda godiset som ska till kundvagnen
const modal = document.querySelector(".modal"); // En query selector på sectiontaggen i HTML dokumentet som ska innehålla Modalen
const overlay = document.querySelector(".overlay"); // En query selector på en div som ska innehålla overlayen som blurrar bakgrunden
const closeModalBtn = document.querySelector(".btn-close"); // En query selector på knappen som ska stänga Modal boxen
const modalTitle = document.querySelector(".titleCandy"); // 
const modalInfo = document.querySelector(".infoCandy");
let candyImg = document.createElement("img");


// close modal function
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});
// open modal function
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

// open modal event
//openModalBtn.addEventListener("click", openModal); // denna gör ingenting längre då funktionen kallas på i onclick på knappen



const getProducts = async () => {
    const data = await fetchProducts();
    products = data;
    renderProducts();


}

const fetchProducts = async () => {
    const res = await fetch('https://www.bortakvall.se/api/products');
    if (!res.ok) {
        throw new Error(`Could not fetch data, reason: ${res.status} ${res.statusText}`);
    }
    return await res.json();

}

const renderProducts = () => {
    console.log("rendering products...");
    //let products = res.json();
    let html = '';
    //products.data.forEach(product => {
    candy = products.data;
    candy.forEach(product => {
        //console.log(product);

        //console.log(product.images['thumbnail']);

        let htmlSegment = `<div class="col-3"> 
            <img src="https://bortakvall.se${product.images['thumbnail']}"> 
            <p class="card-text">${product.name} ${product.price} kr</p>
            <button type="button" onclick="addToCart(${product.id})" class="btn btn-success">Add to cart</button> 
            <button type="info" onclick="getInfo(${product.id})" class="btn btn-info">Info</button>
            </div>`;

        html += htmlSegment;
        containerEl.innerHTML = html;
    })
};

//containerEl.innerHTML = html;

// funktion som tar in ID från klicket
function addToCart(e) {
    console.log(`you clicked product ${e}`);
    const foundCandy = candy.find(candy => candy.id === e); // skapar nya variabel där man sätter variabeln till objectet som tillhör det specifika ID:et som klickades
    console.log(foundCandy);
    shoppingcartCandy.push(foundCandy); // pushar det klickade godiset till en tom array som vi sedan kommer lägga till kundkorgen
    console.log('Shopping cart contains: ', shoppingcartCandy); // konsoll loggar "kundkorgen"
}

function getInfo(e) {
    console.log(`you clicked info of product ${e}`);
    const infoCandy = candy.find(candy => candy.id === e); // skapar ny variabel med objectet vars info-knapp klickas på.
    //alert(infoCandy.description); // alert med description
    openModal(); // öppnar modalboxen
    modalInfo.innerHTML = (`${infoCandy.name} - ${infoCandy.price} kr`); //Placerar godisets namn & pris i modalen
    modalInfo.innerHTML += (`${infoCandy.description}`); //Placerar godisets beskrivning i modalen
    candyImg.src = (`https://bortakvall.se${infoCandy.images['large']}`); // hämtar den stora bilden från objectet för tillhörande godis
    modalInfo.appendChild(candyImg); // renderar ut bilden i modalen
    modalInfo.innerHTML += (`<button type="button" onclick="addToCart(${infoCandy.id})" class="btn btn-success">Add to cart</button>`); //lägger till samma knapp även i Modalen

}


fetchProducts()
    .then(data => console.log('resolved: ', data))
    .catch(err => console.log('rejected:', err.message));
getProducts();
renderProducts();








