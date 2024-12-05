import dotenv from 'dotenv';
dotenv.config();

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string = 'https://api.openweathermap.org/data/2.5';
  private API_KEY?: string = process.env.API_KEY;

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(city: string): string {
    return `${this.baseURL}/forecast?q=${city}&appid=${this.API_KEY}&units=imperial`;
  }
  private buildCurrentWeather(city:string): string {
    return `${this.baseURL}/weather?q=${city}&appid=${this.API_KEY}&units=imperial`
  }
  
  
  // TODO: Build parseCurrentWeather method
  private async parseCurrentWeather(city: string): Promise<Weather> {
    const url = this.buildCurrentWeather(city)
    console.log(url)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch current weather data');
    }
    const data = await response.json();
    return new Weather(
      data.name,
      new Date().toISOString().split('T')[0],
      data.weather[0].icon,
      data.weather[0].description,
      data.main.temp,
      data.wind.speed,
      data.main.humidity
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const selectedData = weatherData.filter((_, index) => index === 0 || index % 8 === 7);

  // Map each of the selected data points to a Weather object
    return selectedData.map(data => 
      new Weather(
        currentWeather.city,
        new Date(data.dt * 1000).toISOString().split('T')[0],
        data.weather[0].icon,
        data.weather[0].description,
        data.main.temp,
        data.wind.speed,
        data.main.humidity
    )
  );
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(city: string): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(city));
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    return await response.json();
  }

  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const currentWeather: Weather = await this.parseCurrentWeather(city);
    const forecastData = await this.fetchWeatherData(city);
    
    const forecast = this.buildForecastArray(currentWeather, forecastData.list);
    
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
