let products = [];
let productCards = document.querySelector('.col-3');
let containerEl = document.querySelector('.row');


const getProducts = async () => {
    const data = await fetchProducts();
    products = data.data;
    renderProducts();
    console.log(products.length);

}

const fetchProducts = async () => {
    const res = await fetch('https://www.bortakvall.se/api/products');
    if (!res.ok) {
        throw new Error(`Could not fetch data, reason: ${res.status} ${res.statusText}`);
    }

    return await res.json();
}



const renderProducts = () => {
    //console.log("rendering products...");
    //let products = res.json();
    let html = '';
    products.forEach(product => {

        //console.log(product.images['thumbnail']);
        let htmlSegment = `<div class="col-3">
        <img src="https://bortakvall.se${product.images['thumbnail']}">
        <p class="card-text">${product.name} ${product.price} kr</p>
        <button type="button" onclick="storeItems(${product.id})" class="btn btn-success" id="addItem">Add to cart</button>
        </div>`;
    
        html += htmlSegment;

    })
      containerEl.innerHTML = html;
   
}

function storeItems(productID) {
    console.log(`You added ${productID} to your cart`);
}

const addItem = document.querySelector('#addItem');
let itemsInCart = [];

addItem.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON') {
        if (e.target.id === 'addItem') {
            itemsInCart.push('test');
        }
    }
  });

  console.log(itemsInCart);

fetchProducts();
getProducts();
renderProducts();




/*let itemsInCart = [];

addItem.addEventListener('click', e => {
	e.preventDefault();
	
	if (e.target.tagName === 'BUTTON') {
		
    	if (e.target.id === 'addItem') {
		console.log('hej');
		
    } 
} }
); */








