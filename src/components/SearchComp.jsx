import { useState } from "react";

export default function SearchComp({ setLocation }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCity(inputValue);
    fetchSuggestions(inputValue);
  };

  const fetchSuggestions = async (inputValue) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`
      );
      const data = await response.json();
      const top5Suggestions = data.slice(0, 5);
      setSuggestions(top5Suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = async (selectedSuggestion) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${selectedSuggestion.display_name}`
      );
      const [selectedCity] = await response.json();

      const { lat, lon } = selectedCity;
      console.log("Selected city coordinates:", lat, lon);
      setLocation((prevLocation) => ({
        ...prevLocation,
        lat: lat,
        lon: lon,
        id: "",
      }));

      setSuggestions([]);

      setCity(selectedSuggestion.display_name);
    } catch (error) {
      console.error("Error fetching selected city coordinates:", error);
    }
  };

  return (
    <>
      <div className="container_search_section">
        <input
          type="text"
          placeholder="Enter city to search"
          className="container_search_section_input"
          value={city}
          onChange={handleInputChange}
        />
        <button className="container_search_section_button">Search</button>
      </div>
      <div className="suggestions">
        {suggestions.map((suggest, index) => (
          <div
            key={index}
            className="suggestion"
            onClick={() => handleSuggestionClick(suggest)}
          >
            {suggest.display_name}
          </div>
        ))}
      </div>
    </>
  );
}

import PropTypes from "prop-types";

SearchComp.propTypes = {
  setLocation: PropTypes.func.isRequired,
};
