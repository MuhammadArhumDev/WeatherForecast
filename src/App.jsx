import { useState, useEffect } from "react";
import "./index.css";
import {
  linkedin,
  clouds,
  moisture,
  thermometer,
  wind,
  rainy,
  sunny,
} from "./assets/images/index";
import WeekComp from "./components/WeekComp";
import HourlyComp from "./components/HourlyComp";
import SearchComp from "./components/SearchComp";

function App() {
  const API_KEY = "23685c7fcb64e5678f3ad8e8b6cddf10";
  const TOKEN = "e670f3dd8e2797";
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    ip: "",
    lat: "",
    lon: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ip = ipData.ip;
        setLocation((prevLocation) => ({
          ...prevLocation,
          ip: ip,
        }));

        const locationRes = await fetch(
          `https://ipinfo.io/${ip}?token=${TOKEN}`
        );
        const locationData = await locationRes.json();
        const loc = locationData.loc.split(",");
        setLocation((prev) => ({
          ...prev,
          lat: loc[0],
          lon: loc[1],
        }));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`
        );
        const weatherData = await weatherRes.json();
        setData(weatherData);
        setLocation((prev) => ({
          ...prev,
          id: weatherData.id,
        }));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (location.lat !== "" && location.lon !== "") {
      fetchWeatherData();
    }
  }, [location.lat, location.lon]);

  useEffect(() => {
    if (data) {
      const weatherCondition = data.weather?.[0]?.icon;
      if (weatherCondition === "01d") {
        document.body.classList.remove("cold");
        document.body.classList.add("warm");
        setFavicon(sunny);
      } else {
        document.body.classList.remove("warm");
        document.body.classList.add("cold");
        setFavicon(clouds);
      }
    }
  }, [data]);

  const setFavicon = (href) => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = href;
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = href;
      document.head.appendChild(newFavicon);
    }
  };

  useEffect(() => {
    document.title = data
      ? `${(data.main?.temp - 273.15)?.toFixed(2)}°C - ${
          data.name
        } Weather Forecast`
      : "Weather Forecast";
  }, [data]);

  return (
    <section className="container inner_width">
      <div className="container_top_section">
        <h1>
          Weather Forecast{" "}
          <span className="credits">
            Credits{" "}
            <a href="https://www.linkedin.com/in/muhammadarhum/">
              @MuhammadArhum
            </a>
          </span>
        </h1>
        {!loading && (
          <h4>
            {new Date().toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </h4>
        )}
        <a href="https://www.linkedin.com/in/muhammadarhum/">
          <img src={linkedin} alt="github logo" width="25" />
        </a>
      </div>

      <SearchComp setLocation={setLocation} />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <main className="container_main_section">
          <div className="container_main_section_current">
            <p>Current Weather</p>

            <div className="container_main_section_current_weather">
              <div className="container_main_section_current_weather_location">
                <p className="container_main_section_current_weather_location_heading">
                  {data.name}, {data.sys?.country}
                </p>
                <p className="container_main_section_current_weather_location_sub_heading">
                  Today{" "}
                  {new Date().toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <div className="container_main_section_current_weather_overcast">
                <p className="heading">
                  {(data.main?.temp - 273.15)?.toFixed(2)}°C
                </p>
                <p className="sub_heading">{data.weather?.[0]?.main}</p>
              </div>
              <img
                src={
                  data.weather?.[0]?.main === "Rain"
                    ? rainy
                    : data.weather?.[0]?.main === "Clouds"
                    ? clouds
                    : sunny
                }
                alt="cloud"
                width="65"
              />
            </div>

            <div className="container_main_section_current_air_conditions">
              <p className="heading">Air Conditions</p>

              <div className="container_main_section_current_air_conditions_field">
                <div className="container_main_section_current_air_conditions_field_child">
                  <div className="top">
                    <img src={thermometer} alt="" width="18" />
                    <p>Real Feel</p>
                  </div>
                  <p>{(data.main?.feels_like - 273.15)?.toFixed(2)}°C</p>
                </div>
                <div className="container_main_section_current_air_conditions_field_child">
                  <div className="top">
                    <img src={wind} alt="" width="18" />
                    <p>Wind</p>
                  </div>
                  <p>{data.wind?.speed} m/s</p>
                </div>
                <div className="container_main_section_current_air_conditions_field_child">
                  <div className="top">
                    <img src={clouds} alt="" width="18" />
                    <p>Clouds</p>
                  </div>
                  <p>{data.clouds?.all}%</p>
                </div>
                <div className="container_main_section_current_air_conditions_field_child">
                  <div className="top">
                    <img src={moisture} alt="" width="18" />
                    <p>Humidity</p>
                  </div>
                  <p>{data.main?.humidity}%</p>
                </div>
              </div>
            </div>

            <div className="container_main_section_current_hourly">
              <HourlyComp location={location} />
            </div>
          </div>

          <div className="container_main_section_weekly">
            <WeekComp location={location} />
          </div>
        </main>
      )}
    </section>
  );
}

export default App;
