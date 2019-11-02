import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Favorite } from '../interfaces/favorite';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})

export class MainService {

  API: string = 'WOCWl0IuLsZtnxJL359UTC2ppdRwXGOq';
  key: string = '215793';
  currCity: string = 'Tel Aviv';
  daysOfTheWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  extNum: any = 0;
  dextNum: any = 0;
  weatherIconNum: any = 1;
  dayWeatherIconNum: any = 1;

  currDateConverted: string;
  text: string = '';
  idCounter: number = 0;

  resultStack: any[] = [];
  resultsItem = new BehaviorSubject<any[]>([]);

  weekWeather: any[] = [];
  weekItem = new BehaviorSubject<any[]>([]);

  favorites: Favorite[] = [];
  favoritesItem = new BehaviorSubject<Favorite[]>([]);

  favoritesNames: any[] = [];
  favoritesNamesItem = new BehaviorSubject<any[]>([]);

  weatherText: any;
  temp: any;
  dayTempMin: any;
  dayTempMax: any;
  currDate: any;
  isDayTime: boolean = true;
  precipitation: boolean = true;

  constructor(private http: HttpClient, public router: Router, private toastr: ToastrService) { }

  getDefaultLocation(key?) {    
    if (key !== undefined) {
      this.key = key;
    }

    this.http.get(`https://dataservice.accuweather.com/currentconditions/v1/${this.key}?apikey=${this.API}`)
      .subscribe(
        res => {
          this.weatherText = res[0]['WeatherText'];
          this.weatherIconNum = res[0]['WeatherIcon'];
          (this.weatherIconNum < 9) ? this.extNum = 0 : this.extNum = '';
          this.temp = res[0]['Temperature']['Metric']['Value'].toFixed(0);
          this.isDayTime = res[0]['IsDayTime'];
          this.precipitation = res[0]['HasPrecipitation'];
        },
        err => {
          this.showErr(err.statusText);
        }
      )

    this.http.get(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${this.key}?apikey=${this.API}`)
      .subscribe(
        res => {
          this.weekWeather = [];
          for (const key in res['DailyForecasts']) {
            this.dayTempMin = (((res['DailyForecasts'][key]['Temperature']['Minimum']['Value']) - 32)) * (5 / 9);
            this.dayTempMax = (((res['DailyForecasts'][key]['Temperature']['Maximum']['Value']) - 32)) * (5 / 9);
            this.dayWeatherIconNum = res['DailyForecasts'][key]['Day']['Icon'];  
            (this.dayWeatherIconNum < 9) ? this.dextNum = 0 : this.dextNum = '';
            this.currDate = new Date(res['DailyForecasts'][key]['Date'].substring(0, 10));
            this.currDateConverted = this.currDate.toString().split(' ')[0];
            this.weekWeather.push({
              'dayTempMin': this.dayTempMin.toFixed(0),
              'dayTempMax': this.dayTempMax.toFixed(0),
              'currDate': this.currDateConverted,
              'dayWeatherIconNum': this.dayWeatherIconNum,
              'extraNum': this.dextNum
            })
            this.weekItem.next(this.weekWeather.slice());
          }
        },
        err => {
          this.showErr(err.statusText);
        })
  }

  getCitiesWeather(typed) {
    this.resultStack = [];
    this.http.get(`https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${this.API}&q=${typed}&language=en-us`)
      .subscribe(
        res => {
          for (const item in res) {
            this.resultStack.push({
              'cityName': res[item]
            })
          }
          this.resultsItem.next(this.resultStack.slice());
        },
        err => { this.showErr(err.statusText) });
  }

  selectedResult(city) {
    this.key = city['Key'];
    this.currCity = city['LocalizedName'];
    this.text = '';
    this.resultStack = [];
    this.resultsItem.next(this.resultStack.slice());
    this.getDefaultLocation();
  }

  removeFromFavorites(id) {
    this.favorites.splice(id, 1);
    this.favoritesItem.next(this.favorites.slice());
    this.favoritesNames.splice(id, 1);
    this.favoritesNamesItem.next(this.favoritesNames.slice());
  }

  addToFavorites() {
    this.favorites.push({
      'name': this.currCity,
      'key': this.key,
      'id': this.idCounter,
      'temp': this.temp,
      'currWeatherText': this.weatherText,
      'isDayTime': this.isDayTime,
      'favoriteIcon': this.weatherIconNum,
      'extNum': this.extNum,
      'precipitation': this.precipitation
    })
    this.favoritesItem.next(this.favorites.slice());
    this.favoritesNames.push(this.currCity);
    this.favoritesNamesItem.next(this.favoritesNames.slice());
    this.idCounter++;
  }

  addToMain(key, i) {
    this.currCity = this.favorites[i]['name'];
    this.getDefaultLocation(key);
    this.router.navigate(['home']);
  }

  isDisabled(currCityName) {
    for (const element of this.favoritesNames) {
      if (element === currCityName) { return true }
    }
  }

  showErr(error) {
    this.toastr.error(error);
  }
}
