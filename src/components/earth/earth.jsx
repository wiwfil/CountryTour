import React, { useState, memo, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import axios from "axios";

const Earth = ({ setTooltipContent }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [zoom, setZoom] = useState(1);

  const [search, setSearch] = useState("");

  const [rawData, setRawData] = useState(null);
  const [countries, setCountries] = useState(null);

  const [name, setName] = useState("");
  const [flag, setFlag] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [languages, setLanguages] = useState({});
  const [region, setRegion] = useState("");
  const [capital, setCapital] = useState("");
  const [population, setPopulation] = useState(0);
  const [maps, setMaps] = useState("");
  const [independent, setIndependent] = useState(true);
  const [currency, setCurrency] = useState({});
  const [borders, setBorders] = useState([]);
  const [area, setArea] = useState(0);

  const setCountryInfo = (name, isClicked = false) => {
    if (isClicked) {
      const searchBox = document.getElementById("search-box");
      if (searchBox) {
        searchBox.value = "";
        setSearch("");
      }
    }


    name = name.toLowerCase();

    countries?.map((country) => {
      if (
        country.name.official.toLowerCase() === name ||
        country.name.common.toLowerCase() === name
      ) {
        setName(name);
        setFlag(country.flags.png);
        setOfficialName(country.name.official);
        setLanguages(country.languages ? country.languages : "");
        setRegion(country.region);
        setCapital(country.capital);
        setPopulation(country.population);
        setMaps(country.maps.googleMaps);
        setIndependent(country.independent);
        setCurrency(country.currencies ? country.currencies : "");
        setBorders(country.borders);
        setArea(country.area);
        return country;
      } else {
        return null;
      }
    });
  };
  const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

  const handleZoomIn = () => {
    setZoom((prev) => (prev < 10 ? prev + 0.25 : 10));
  };

  const handleZoomOut = () => {
    setZoom((prev) => (prev > 0.25 ? prev - 0.25 : 0.25));
  };

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((data) => {
      setRawData(data.data);
      setIsLoading(false);
      let initialCountry = data.data[188];
      setName(initialCountry.name.common.toLowerCase());
      setFlag(initialCountry.flags.png);
      setOfficialName(initialCountry.name.official);
      setLanguages(initialCountry.languages);
      setRegion(initialCountry.region);
      setCapital(initialCountry.capital);
      setPopulation(initialCountry.population);
      setMaps(initialCountry.maps.googleMaps);
      setIndependent(initialCountry.independent);
      setCurrency(initialCountry.currencies);
      setBorders(initialCountry.borders);
      setArea(initialCountry.area);
    });
  }, []);

  useEffect(() => {
    setCountries(
      rawData?.filter(
        (country) =>
          country.name.common.toLowerCase().includes(search) ||
          country.name.official.toLowerCase().includes(search)
      )
    );
    setCountryInfo(
      rawData?.filter(
        (country) =>
          country.name.common.toLowerCase().includes(search) ||
          country.name.official.toLowerCase().includes(search)
      )?.length > 0
        ? rawData?.filter(
            (country) =>
              country.name.common.toLowerCase().includes(search) ||
              country.name.official.toLowerCase().includes(search)
          )[0].name.common
        : ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, rawData]);

  return (
    <>
      {!isLoading ? (
        <div className="earth-container" data-tip="">
          <div className="earth-column">
            <div className="pair column-head">
              <img className="earth-flag" src={flag} alt="flag"></img>
              <span className="common-name">{name}</span>
            </div>

            <div className="pair">
              <label className="key">Official Name:</label>
              <span className="value">{officialName}</span>
            </div>

            <div className="pair">
              <label className="key">Language:</label>
              <span className="value">
                {Object.values(languages)?.join("-")}
              </span>
            </div>

            <div className="pair">
              <label className="key">Region:</label>
              <span className="value">{region}</span>
            </div>
            <div className="pair">
              <label className="key">Capital:</label>
              <span className="value">{capital ? capital.join("-") : ""}</span>
            </div>
            <div className="pair">
              <label className="key">Population:</label>
              <span className="value">{population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>
          </div>
          <div className="main-content">
            <input
              id="search-box"
              type="text"
              placeholder="Search.."
              name="search"
              onChange={(e) => {
                setSearch(e.target.value.toLowerCase());
              }}
            />
            <div className="wrapper">
              <div className="zoom-elements">
                <button className="zoom" onClick={() => handleZoomIn()}>
                  +
                </button>
                <button className="zoom" onClick={() => handleZoomOut()}>
                  -
                </button>
              </div>
              <ComposableMap
                style={{
                  width: "100%",
                  height: "",
                  borderRadius: "12px",
                }}
              >
                <ZoomableGroup
                  center={[15, 0]}
                  zoom={zoom}
                  translateExtent={[
                    [-200, -200],
                    [1000, 800],
                  ]}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo, index) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => {
                            setCountryInfo(geo.properties.name, true);
                          }}
                          onMouseEnter={() => {
                            setTooltipContent(`${geo.properties.name}`);
                          }}
                          onMouseLeave={() => {
                            setTooltipContent("");
                          }}
                          style={{
                            default: {
                              fill:
                                name !== geo.properties.name.toLowerCase()
                                  ? "#85603F"
                                  : "#BD9354",
                              filter:
                                name !== geo.properties.name.toLowerCase()
                                  ? "none"
                                  : "drop-shadow(3px 3px 3px black) ",
                              outline: "none",
                              stroke: "black",
                            },
                            hover: {
                              fill: "#BD9354",
                              outline: "none",
                              filter: "drop-shadow(3px 3px 3px black) ",
                              cursor: "pointer",
                            },
                            pressed: { fill: "#02A" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>
          </div>
          <div className="earth-column">
            <div className="pair">
              <label className="key">Maps:</label>
              <a href={maps} className="link">
                {maps}
              </a>
            </div>

            <div className="pair">
              <label className="key">Independence:</label>
              <span className="value">
                {independent === true ? "independent" : "dependent"}
              </span>
            </div>

            <div className="pair">
              <label className="key">Currency:</label>
              <span className="value">
                {Object.keys(currency)?.map(
                  (cur) => `${cur}(${currency[cur].symbol})`
                )}
              </span>
            </div>
            <div className="pair">
              <label className="key">Borders:</label>
              <span className="value">
                {borders
                  ? borders.map((item) => item.toLowerCase()).join(" , ")
                  : ""}
              </span>
            </div>
            <div className="pair">
              <label className="key">Area:</label>
              <span className="value">{areax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading"> Loading... </div>
      )}
    </>
  );
};

export default memo(Earth);
