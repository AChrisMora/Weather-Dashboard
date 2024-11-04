import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
    // TODO: save city to search history
    await HistoryService.addCity(cityName);
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }

});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error)
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to delete city from history' });
  }
});

export default router;
