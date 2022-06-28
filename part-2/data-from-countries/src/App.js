import { useState, useEffect } from "react";
import axios from "axios";

const CountryView = ({ country }) => {
  const languages = Object.values(country.languages).map((language) => (
    <li key={language}>{language}</li>
  ));

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <p>languages: </p>
      <ul>{languages}</ul>
      <img alt="country flag" src={country.flags.png}></img>
    </>
  );
};

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length !== 1) {
    const countryList = countries.map((country) => (
      <p key={country.name.common}>{country.name.common}</p>
    ));

    return <>{countryList}</>;
  } else if (countries.length === 1) {
    return <CountryView country={countries[0]} />;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => setCountries(response.data));
  }, []);

  const filterTracker = (event) => {
    setFilter(event.target.value);
  };

  const filterCountries = () => {
    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(filter)
    );
  };

  return (
    <div>
      find countries <input onChange={filterTracker}></input>
      <Countries countries={filterCountries()} />
    </div>
  );
};

export default App;
