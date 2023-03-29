import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');
const DEBOUNCE_DELAY = 300;

searchBox.addEventListener(
  'input',
  debounce(() => handleInput(searchBox.value.trim()), DEBOUNCE_DELAY)
);

function handleInput(input) {
  resetRender();

  if (!input) return;

  fetchCountries(input)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length == 1) {
        renderCountryInfo(data[0]);
      } else {
        renderListOfCountries(data);
        awaitCountrySelection(data);
      }
    })
    .catch(error => {});
}

function renderListOfCountries(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li id="${name.official}"><img class="" width="30px" src="${flags.svg}" alt="${flags.alt}"/><span>${name.official}</span></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo({ flags, name, capital, population, languages }) {
  const markup = `<p><img class="" width="80px" src="${flags.svg}"
  alt="${flags.alt}"/>
  <span class="country-name"><b>${name.official}</b></span></p>
  <p>Capital: <b>${capital}</b></p>
  <p>Population: <b>${population}</b></p>
  <p>Languages: <b>${Object.values(languages).join(', ')}</b></p>`;

  countryInfo.innerHTML = markup;
}

function awaitCountrySelection(countries) {
  countryList.addEventListener('click', event => {
    const selectedCountry = countries.filter(
      country => country.name.official == event.target.parentNode.id
    )[0];
    if (selectedCountry) {
      resetRender();
      renderCountryInfo(selectedCountry);
    }
  });
}

function resetRender() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
