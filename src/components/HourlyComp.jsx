import { useEffect, useState } from "react";
import { clouds, rainy, sunny } from "../assets/images/index.js";
import "../index.css";

export default function HourlyComp({ location }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_KEY = "23685c7fcb64e5678f3ad8e8b6cddf10";

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?id=${location.id}&appid=${API_KEY}`
        );
        const weatherData = await weatherRes.json();
        setData(weatherData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let hourlyForecastData = [];
  if (data && data.list) {
    hourlyForecastData = data.list.slice(0, 5).map((item) => ({
      time: item.dt_txt.slice(11, 16),
      temperature: Math.round(item.main.temp - 273.15),
      weather: item.weather[0],
    }));
  }

  return (
    <>
      <p className="heading">Hourly Forecast</p>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && data.list && data.list.length > 0 && (
        <div className="container_main_section_current_hourly_field">
          {hourlyForecastData.map((hourData, index) => (
            <div
              className="container_main_section_current_hourly_field_child"
              key={index}
            >
              <p className="hours">{hourData.time}</p>
              <img
                src={
                  hourData.weather.main === "Rain"
                    ? rainy
                    : hourData.weather.main === "Clouds"
                    ? clouds
                    : sunny
                }
                alt="clouds"
                width="33"
              />
              <p className="temperature">{hourData.temperature} °C</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

import PropTypes from "prop-types";

HourlyComp.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.any.isRequired,
    lon: PropTypes.any.isRequired,
    id: PropTypes.any,
  }).isRequired,
};
