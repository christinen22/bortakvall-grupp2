import './style.css'

type productsTS = { // denna kan vi lägga i en extern fil och exportera/importera - se 40-async-todos-ts i interfaces.ts
  id: number,
  name: string,
  description: string,
  price: number,
  on_sale: boolean,
  images: any, //vad ska vi ha för datatyp här? Object ger oss fel. String ger också fel, även om det fungerar. 
  stock_status: string,
  stock_quantity?: null,
  //data: any

};

let products: productsTS[] = [];
//let products: any = [];
let containerEl = document.querySelector('.row');


const fetchProducts = async () => {
  const res = await fetch('https://www.bortakvall.se/api/products');

  if (!res.ok) {
    throw new Error(`Could not fetch data, reason: ${res.status} ${res.statusText}`);

  }

  const data = await res.json();
  products = data.data;
  console.log(products);
  renderProducts();
  return data;

}

fetchProducts()
  .then(data => console.log('resolved: ', data))
  .catch(err => console.log('rejected:', err.message));


//const getProducts = async () => {
//products = await fetchProducts();

//products = products.data;
//console.log(typeof (products));
//console.log(products);
//console.log(products);
//renderProducts();
//console.log(products.length);
//console.log(products);

//}

// const fetchProducts = async () => {
//   const res = await fetch('https://www.bortakvall.se/api/products');
//   if (!res.ok) {
//     throw new Error(`Could not fetch data, reason: ${res.status} ${res.statusText}`);
//   }

//   return await res.json() as productsTS[];

// }
let html = '';
const renderProducts = () => {
  console.log("rendering products...");
  //products = res.json();

  products.forEach(product => {

    //console.log(product.images['thumbnail']);
    let htmlSegment = `<div class="col-3"> 
            <img src="https://bortakvall.se${product.images['thumbnail']}"> 
            <h2 class="card-text">${product.name} ${product.price} kr</h2>
            <button type="button" class="btn btn-success">Add to cart</button> 
            <button type="info" id="${product.id}" class="btn btn-info">Info</button>
            </div>`; // <div> ${product.description}</div> - kan läggas till

    html += htmlSegment;
  });

  containerEl!.innerHTML = html;
}



//fetchProducts();
//getProducts();
//renderProducts();

