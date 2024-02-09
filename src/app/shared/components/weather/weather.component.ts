import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {WeatherService} from "@app/services/weather/weather.service";
import {Subscription} from "rxjs";
import {DatePipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {LocalStorageService} from "@app/services/local-storage/local-storage.service";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    NgOptimizedImage,
    JsonPipe,
    DatePipe
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit , OnDestroy{


  protected readonly weatherService = inject(WeatherService);
  private readonly localStorageService = inject(LocalStorageService);
  private subscription = new Subscription();
  weather: any = {};
  forecast: any = {};
  isShowWeeklyForecast = false;
  weekDays = new Set<any>([])

  ngOnInit(): void {

    if ( this.localStorageService.getWithExpiration("weather")!== null) {
      this.weather = this.localStorageService.getWithExpiration("weather");
    }else {
      this.subscription.add(
        this.weatherService.getWeatherByCity().subscribe((data: any) => {
          this.localStorageService.setWithExpiration("weather",data,1);
          this.weather = data;
        })
      );
    }

    if (this.localStorageService.getWithExpiration("forecast") !== null) {
      this.forecast = this.localStorageService.getWithExpiration("forecast");
    }else {
      this.subscription.add(
        this.weatherService.getWeeklyForecast().subscribe((data: any) => {
          this.localStorageService.setWithExpiration("forecast",data,5);
          this.forecast = data;
        })
      );
    }

    this.forecast.list.map((day: any) => this.weekDays.add(new Date(day.dt_txt).toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'})));

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onShowWeeklyForecast() {
    this.isShowWeeklyForecast = !this.isShowWeeklyForecast;
  }
}
