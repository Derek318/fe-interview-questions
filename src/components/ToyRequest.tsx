/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Button, Col, Row, Typography } from "antd";

const { Title } = Typography;

// interface WeatherData {
//   lat
//   longitu
//   temp
//   humidity
// }

function ToyRequest() {
  // needs to go to secure key storage
  const apiKey = "ce309858c9580a2f86ac0e0f45374afb";
  const [isLoading, setIsLoading] = useState(true);
  const [lat, setLat] = useState<null | number>(null);
  const [long, setLong] = useState<null | number>(null);
  const [weatherId, setWeatherId] = useState<null | string>(null);
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(0);
  const [showF, setShowF] = useState(true);

  const successCallback = (position: any) => {
    setLat(position.coords.latitude);
    setLong(position.coords.longitude);
  };

  const errorCallback = (error: any) => {
    console.log(error);
  };

  function toF(temp: number) {
    return Math.round(temp * (9 / 5) - 459.67);
  }

  function toC(temp: number) {
    return Math.round(temp - 273.15);
  }

  useEffect(() => {
    const setCoords = async () => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };
    setCoords();
  }, [lat, long]);

  // fetch weather
  useEffect(() => {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      long +
      "&appId=" +
      apiKey;
    const sendPostRequest = async () => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      try {
        let response: AxiosResponse;
        response = await axios.get(url);
        const data = response.data;
        setWeatherId(data.weather[0].icon);
        setCity(data.name);
        setTemp(data.main.temp);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (lat && long) {
      sendPostRequest();
    }
  }, [lat, long]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Weather Today</h2>
          <img
            src={"http://openweathermap.org/img/wn/" + weatherId + "@2x.png"}
          />
          <Col span={24}>
            <Row align={"middle"} justify={"center"}>
              <Title>{city}</Title>
            </Row>

            <Row align={"middle"} justify={"center"}>
              <Title>{showF ? toF(temp) : toC(temp)}</Title>
              <Button
                style={{ marginLeft: "20px", alignSelf: "center" }}
                // style={paddingLeft: "20px"},
                size="large"
                type="primary"
                title="C | F"
                onClick={() => {
                  setShowF(!showF);
                }}
              >
                C | F
              </Button>
            </Row>
          </Col>
        </div>
      )}
    </div>
  );
}

export default ToyRequest;
