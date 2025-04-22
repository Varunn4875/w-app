// import SearchSection from "./components/SearchSection.jsx";
// import CurrentWeather from "./components/CurrentWeather";
// import HourlyWeatherItem from "./components/HourlyWeatherItem";
// import { weatherCodes } from "./constants";
// import { useEffect, useRef, useState } from "react";
// import NoResultsDiv from "./components/NoResultsDiv";
import SearchSection from "./SearchSection";
import CurrentWeather from "./CurrentWeather";
import HourlyWeatherItem from "./HourlyWeather";
import { weatherCodes } from "./constants";
import { useEffect,useRef,useState } from "react";
import NoResultsDiv from "./NoResultsDiv";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const searchInputRef = useRef(null);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    // Filter the hourly data to only include the next 24 hours
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecasts(next24HoursData);
  };
  // Fetches weather details based on the API URL
  const getWeatherDetails = async (API_URL) => {
    setHasNoResults(false);
    window.innerWidth <= 768 && searchInputRef.current.blur();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();
      // Extract current weather data
      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      const weatherIcon = Object.keys(weatherCodes).find((icon) => weatherCodes[icon].includes(data.current.condition.code));
      setCurrentWeather({ temperature, description, weatherIcon });
      // Combine hourly data from both forecast days
      const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
      searchInputRef.current.value = data.location.name;
      filterHourlyForecast(combinedHourlyData);
    } catch {
      // Set setHasNoResults state if there's an error
      setHasNoResults(true);
    }
  };
  // Fetch default city (London) weather data on initial render
  useEffect(() => {
    const defaultCity = "London";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2`;
    getWeatherDetails(API_URL);
  }, []);
  return (
    <div className="container">
      {/* Search section */}
      <SearchSection getWeatherDetails={getWeatherDetails} searchInputRef={searchInputRef} />
      {/* Conditionally render based on hasNoResults state */}
      {hasNoResults ? (
        <NoResultsDiv />
      ) : (
        <div className="weather-section">
          {/* Current weather */}
          <CurrentWeather currentWeather={currentWeather} />
          {/* Hourly weather forecast list */}
          <div className="hourly-forecast">
            <ul className="weather-list">
              {hourlyForecasts.map((hourlyWeather) => (
                <HourlyWeatherItem key={hourlyWeather.time_epoch} hourlyWeather={hourlyWeather} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
// function App() {

//   return (
//     <>
//       <div className="container">
//         {/*search sectyion*/}
//     <div className="search-section">
//         <form action="#" className="search-form">
//         <span className="material-symbols-rounded">search</span>
//         <input type="search" placeholder="Enter a city name" className="search-input" required />
//          </form>
//          <button className="location-button"> 
//          <span className="material-symbols-outlined">my_location</span>
//         </button>
//     </div>

//         <div className="weather-section">
//           <div className="current-weather">
//             <img src="icons/clouds.svg" className="weather-icon"/>
//              <h2 className='temperature'>20<span>°C</span></h2>
//                <p className="description">Partly cloudy</p>
//           </div>

//           <div className="hourly-forecast">
//             <ul className="weather-list">
//               <li className="weather-item">
//                 <p className="time">00:00</p>
//                 <img src="icons/clouds.svg" className="weather-icon"/>
//                 <p className="temperature">20°</p>
//               </li>
//               <li className="weather-item">
//                 <p className="time">00:00</p>
//                 <img src="icons/clouds.svg" className="weather-icon"/>
//                 <p className="temperature">20°</p>
//               </li>
//               <li className="weather-item">
//                 <p className="time">00:00</p>
//                 <img src="icons/clouds.svg" className="weather-icon"/>
//                 <p className="temperature">20°</p>
//               </li>
//               <li className="weather-item">
//                 <p className="time">00:00</p>
//                 <img src="icons/clouds.svg" className="weather-icon"/>
//                 <p className="temperature">20°</p>
//               </li>
//               <li className="weather-item">
//                 <p className="time">00:00</p>
//                 <img src="icons/clouds.svg" className="weather-icon"/>
//                 <p className="temperature">20°</p>
//               </li>
//               <li className="weather-item">
//                 <p className="time">00:00</p>
//                 <img src="icons/clouds.svg" className="weather-icon"/>
//                 <p className="temperature">20°</p>
//               </li>
//             </ul>
//           </div>

//         </div>
//       </div>
//         </>
        
        
// )}

// export default App;
