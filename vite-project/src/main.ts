import './style.css'

console.log('hej');

const fetchApi = async () => {
  const res = await fetch("https://www.bortakvall.se/api/");
  if (!res.ok) {
    throw new Error(`Could not fetch candy, because ${res.status} ${res.statusText}`);
  };

  const candy = await res.json();

  candy: String = document.querySelector<HTMLDivElement>('#app')


};

// const renderApi = () => {
//   console.log('rendering api...');
// };