import { Notify } from 'notiflix';

function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(
        Notify.failure('Oops, there is no country with that name')
      );
    }
    return response.json();
  });
}
export { fetchCountries };
