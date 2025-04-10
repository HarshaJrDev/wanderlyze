import axios from 'axios';

export const getWeatherForecast = async (latitude: number, longitude: number) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  const response = await axios.get(url);
  return response.data.daily; // contains arrays: time[], temperature_2m_max[], etc.
};
