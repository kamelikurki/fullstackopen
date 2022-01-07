import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({newFilter, handleNewFilter}) =>
{
  return (
  <form>
    <div>
      Find countries: <input value={newFilter} onChange={handleNewFilter}/>
    </div>
  </form>
  )
}


const Country = ({country, apikey}) => 
{
  const [temperature, setTemperature] = useState('')
  const [wind, setWind] = useState('')
  const [weatherLogo, setWeatherLogo] = useState('')
  console.log(country)
  const city =  country.capital[0]
  let weatherURL = 'http://api.weatherstack.com/current?access_key=' + apikey + '&query=' +city
  const weatherHook = () => {
    axios
      .get(weatherURL)
      .then(response => {
        setWeatherLogo(response.data.current.weather_icons[0])
        setWind("Wind speed:" + response.data.current.wind_speed + " km/h Wind direction: " + response.data.current.wind_dir)
        setTemperature(response.data.current.temperature)
      })
  }
  
  useEffect(weatherHook, [])

  

  const languageList = Object.values(country.languages).map(language => <li key={language}> {language}</li>)
  const flagURL = country.flags['png']

  return (  
    <div>     
      <h3>{country.name.common} </h3>
      <p>
      Capital: {country.capital[0]} <br/>
      Population: {country.population}<br/>
      </p>
      <h3>Languages</h3>
      {languageList}
      <h3>Flag</h3>
      <img src={flagURL}/>
      <h3>Weather in {country.capital[0]}</h3>
      Temperature : {temperature} Celcius<br/>
      {wind}<br/> 
      <img src={weatherLogo}/>

    </div>
  )
}


const CountryList = ({countries, clickCallback}) => 
{
  let output = countries.map(country => <p key={country.cca2}> {country.name.common}<button onClick={() => clickCallback(country)}> show</button></p>)

  return(
    output
  )
}


const App = () => {

  const [newFilter, setNewFilter] = useState('')
  const [countryList, setCountryList] = useState([])

  const api_key = process.env.REACT_APP_API_KEY

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountryList(response.data)
      })
  }
  
  useEffect(hook, [])

  const countriesToShow = countryList.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const handleClick = (newCountry) =>
  {
    setNewFilter(newCountry.name.common)
  }

  let output = ''

  if(countriesToShow.length > 10)
  {
    output = 'Too many matches, specify another filter'
  }
  else if(countriesToShow.length > 1)
  {
    output = <CountryList countries={countriesToShow} clickCallback={handleClick}/>
  }
  else if(countriesToShow.length === 1)
  {
    output = <Country country={countriesToShow[0]} apikey={api_key}/>
  }

  return (
    <div>
    <Filter newFilter={newFilter} handleNewFilter={handleNewFilter}/>
    {output}
    </div>
  );
}

export default App;
