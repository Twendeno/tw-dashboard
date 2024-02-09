import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly http = inject(HttpClient);
  private readonly weather_url: string = `${environment.WEATHER_API.URL}/${environment.WEATHER_API.WEATHER}${environment.WEATHER_API.API_KEY}`;
  private readonly forecast_url: string = `${environment.WEATHER_API.URL}/${environment.WEATHER_API.FORECAST}${environment.WEATHER_API.API_KEY}`;

  // private readonly PN_COORDINATE = {lat:-4.769162,lon:11.866362};
  private readonly PN_COORDINATE = {lat:44.83769122966934,lon:-0.579042973886053};

  getWeatherByCity(lat: number= this.PN_COORDINATE.lat, lon: number=this.PN_COORDINATE.lon,units: string='metric',lang: string='fr'){
    return this.http.get(`${this.weather_url}&lat=${lat}&lon=${lon}&units=${units}&lang=${lang}`)
  }

  getWeeklyForecast(lat: number= this.PN_COORDINATE.lat, lon: number=this.PN_COORDINATE.lon,units: string='metric',lang: string='fr'){
    return this.http.get(`${this.forecast_url}&lat=${lat}&lon=${lon}&units=${units}&lang=${lang}`)
  }
}
