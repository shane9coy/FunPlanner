import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export async function getLocation() {
    const apiKey = process.env.IPINFO_API_KEY;
    const res = await fetch(`https://ipinfo.io/json?token=fbcd2ad2cb1268`);
    const data = await res.json();
    return `${data.city}, ${data.region}`;
}

export async function getCurrentWeather(location) {
    // location should be a string like "Columbus, OH"
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = encodeURIComponent(location.split(",")[0]);
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=6fa161b254522f8780966bae62ab8a23`);
    const data = await res.json();
    return JSON.stringify({
        temperature: data.main.temp,
        units: "F",
        forecast: data.weather[0].main
    });
}