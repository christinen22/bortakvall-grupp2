import { shoppingcartCandy} from "./bortakvallmain";
import { sum } from "./bortakvallmain";

// Base URL and endpoint from where we fetch the candy
export const baseUrl = 'https://www.bortakvall.se';


// Promise for baseUrl and changeable endPoint
export const fetchApi = async (endPoint: string) => {
    const res = await fetch(baseUrl + endPoint);

    // If fetch not succeeds throw error
    if (!res.ok) {
        throw new Error(`Något gick fel: ${res.status} ${res.statusText}`)
    };
    return await res.json();
};






let submitData: object = {};

// Finding all input fields from order form
const firstName = document.querySelector("#fname");
const lastName = document.querySelector("#lname");
const address = document.querySelector("#address");
const zipCode = document.querySelector("#zipcode");
const city = document.querySelector("#city");
const email = document.querySelector("#email");
const telephone = document.querySelector("#telephone");

export const submitOrder = async () => {

    let shoppingCartItems: object = await shoppingcartCandy.map(e => {
        return { product_id: e.id, qty: e.qty, item_price: e.price, item_total: e.price * e.qty }
    });

    // Values from customer input fields to add to POST body
    submitData = {
        customer_first_name: (firstName as HTMLInputElement | null)?.value,
        customer_last_name: (lastName as HTMLInputElement | null)?.value,
        customer_address: (address as HTMLInputElement | null)?.value,
        customer_postcode: (zipCode as HTMLInputElement | null)?.value,
        customer_city: (city as HTMLInputElement | null)?.value,
        customer_email: (email as HTMLInputElement | null)?.value,
        customer_phone: (telephone as HTMLInputElement | null)?.value,
        order_total: sum,
        order_items: shoppingCartItems,
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