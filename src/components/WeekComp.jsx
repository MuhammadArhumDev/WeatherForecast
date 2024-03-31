import { useEffect, useState } from "react";

import {
  clouds,
  moisture,
  thermometer,
  sunny,
  wind,
  rainy,
} from "../assets/images/index.js";
import "../index.css";
import PropTypes from "prop-types";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function WeekComp({ location }) {
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
  }, [location.id]);

  const getNextSixDaysData = () => {
    if (!data || !data.list) return [];
    const currentDate = new Date();
    const nextSixDays = [];
    for (let i = 0; i < 6; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const dayIndex = nextDate.getDay();
      nextSixDays.push(
        data.list.find((day) => {
          const forecastDate = new Date(day.dt * 1000);
          return forecastDate.getDay() === dayIndex;
        })
      );
    }
    return nextSixDays;
  };

  const nextSixDaysData = getNextSixDaysData();

  useEffect(() => {
    console.log("Data:", data);
    console.log("API_KEY: ");
  }, [data]);

  return (
    <>
      <p>Weekly Forecast</p>

      <div className="container_main_section_weekly_cards">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {nextSixDaysData.map((day, index) => {
          if (!day) return null;
          const timestamp = day.dt * 1000;
          const date = new Date(timestamp);
          const dayIndex = date.getDay();
          const dayName = daysOfWeek[dayIndex];

          const temperature =
            day.main && day.main.temp
              ? (day.main.temp - 273.15).toFixed(2)
              : null;
          const weatherMain =
            day.weather && day.weather[0] ? day.weather[0].main : null;
          const cloudsPercentage = day.clouds ? day.clouds.all : null;
          const windSpeed = day.wind ? day.wind.speed : null;
          const humidity = day.main ? day.main.humidity : null;

          return (
            <div
              className="container_main_section_weekly_cards_field"
              key={index}
            >
              <div className="container_main_section_weekly_cards_field_left">
                <p className="container_main_section_weekly_cards_field_left_heading">
                  {dayName}
                </p>
                <div className="container_main_section_weekly_cards_field_left_status">
                  <img
                    src={
                      weatherMain === "Rain"
                        ? rainy
                        : weatherMain === "Clouds"
                        ? clouds
                        : sunny
                    }
                    alt="status"
                    width="31"
                  />
                  <p>{weatherMain}</p>
                </div>
              </div>

              <div className="container_main_section_weekly_cards_field_center">
                <div className="container_main_section_weekly_cards_field_center_top">
                  <img src={thermometer} alt="temperature" width="20" />
                  <p>{temperature ? `${temperature}°C` : "N/A"}</p>
                </div>
                <div className="container_main_section_weekly_cards_field_center_bottom">
                  <img src={clouds} alt="clouds" width="31" />
                  <p>{cloudsPercentage ? `${cloudsPercentage}%` : "0%"}</p>
                </div>
              </div>

              <div className="container_main_section_weekly_cards_field_right">
                <div className="container_main_section_weekly_cards_field_right_top">
                  <img src={wind} alt="arrow up" width="20" />
                  <p>{windSpeed ? `${windSpeed} m/s` : "N/A"}</p>
                </div>
                <div className="container_main_section_weekly_cards_field_right_bottom">
                  <img src={moisture} alt="arrow down" width="20" />
                  <p>{humidity ? `${humidity}%` : "N/A"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

WeekComp.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.any.isRequired,
    lon: PropTypes.any.isRequired,
    id: PropTypes.any,
  }).isRequired,
};
