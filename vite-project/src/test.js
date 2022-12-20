let products = [];
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
    console.log("rendering products...");
    //let products = res.json();
    let html = '';
    products.forEach(product => {

        console.log(product.images['thumbnail']);
        let htmlSegment = `<div class="col-3"> 
            <img src="https://bortakvall.se${product.images['thumbnail']}"> 
            <p class="card-text">${product.name} ${product.price} kr</p>
            <button type="button" class="btn btn-success">Add to cart</button> 
            </div>`;

        html += htmlSegment;
    });

    containerEl.innerHTML = html;


    //console.log(asd1);

}

fetchProducts();
getProducts();
renderProducts();






