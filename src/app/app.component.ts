import { Component, OnChanges, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import {spinnerWorks} from "./import.js"
import { faSync, faCloud, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { Forecast } from './forecast.class';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faSync = faSync;
  faTint = faTint;
  faWind = faWind;
  faCloud = faCloud;
  faSearch = faSearch;
  formCity = "Münster";
  formInput: string;
  formCountry = "DE";
  weatherState: Forecast;
  reloadSpinner: boolean = false;
  letterCelsius: boolean = true;
  units: 'metric' | 'imperial' = 'metric';
  mainWeatherImg: string;
  onedayWeatherImg: string;
  twodayWeatherImg: string;
  threedayWeatherImg: string;
  weatherForcast: any[];
  showInput: boolean = false;
  searchInputInvalid: boolean = false;
  searchPlaceholder: string = "Münster, DE";
  wind: number;
  
  constructor(private http: HttpClient) {
    this.getWeatherWithTimeout("Münster","Germany");  
    
  }

  searchIconFunction() {
    if(this.showInput === false ) {
      this.showInput = true;
    } else {
        this.parseInput(this.formInput);
      }
  }

  async getWeather(town,country) {
    this.searchInputInvalid = false;
    this.reloadSpinner = true;

  try {
    const response = await this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=10e913130e75c308b518d5e8710fb645&units=${this.units}`).toPromise(); //await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=10e913130e75c308b518d5e8710fb645&units=${this.units}`);
    const weatherData = response; //await response.json();
    
    return weatherData;
  } catch (err) {
    console.log(err);
    this.searchInputInvalid = true;
    return undefined;
  }

  
}


  async processResponse(town, country) {


      
      let weatherData: any = await this.getWeather(town,country);
  
      if(weatherData) {
        
        const oneCallResponse = await this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,minutely,hourly&appid=10e913130e75c308b518d5e8710fb645&units=${this.units}`).toPromise(); 
        const oneCallData = oneCallResponse;
        weatherData.futureForecasts = oneCallData['daily'];
        let forecast = plainToClass(Forecast, weatherData, { excludeExtraneousValues: true});
  
        this.weatherState = forecast;
        this.mainWeatherImg = this.getWeatherImage(this.weatherState);
        this.onedayWeatherImg = this.getWeatherImage(forecast.futureForecasts[1]);
        this.twodayWeatherImg = this.getWeatherImage(forecast.futureForecasts[2]);
        this.threedayWeatherImg = this.getWeatherImage(forecast.futureForecasts[3]);
        
        if(this.weatherState.weatherDesc.length >= 15) {
          document.getElementById('celsius-wording').style.marginTop = "-8.5rem";
        } else {
          document.getElementById('celsius-wording').style.marginTop = "-10.5rem";
        }

        this.wind = this.weatherState.getWind(this.units);
  
        this.showInput=false;
  


    }

  
  

  }


  async getWeatherWithTimeout(town, country) {

    // The idea is to run a timeout and the weather request simultaneously. Then only stop the spinner after the weather request AND timeout have finished.

    console.log("start", new Date());
    let promiseArr = [this.processResponse(town, country), this.timeout(2000)];

    let result = await Promise.all(promiseArr);
    console.log("finish", new Date());

    this.searchPlaceholder = this.weatherState.place + ", " + this.weatherState.country; 
    this.formInput = "";
    this.reloadSpinner = false;
  }



  getWeatherImage(weatherObj) {

    let idFirstDigit = weatherObj.id.toString().charAt(0);

    if(idFirstDigit === '2') { return "./assets/screenshot_3.png"; } 
    else if (idFirstDigit === '3') {
      return "./../assets/screenshot_7.png";
    }
    else if(weatherObj.id === 500 || weatherObj === 501) {
      return "./assets/screenshot_4.png";
    }
    else if(idFirstDigit === '5') {
      return "./assets/screenshot_5.png";
    }
    else if(idFirstDigit === '6') {
      return "./assets/screenshot_6.png";
    }
    else if(idFirstDigit === '7') {
      return "./assets/screenshot_13.png";
    }
    else if(weatherObj.id === 800) {
      if(weatherObj.icon === "01d") {
      return "./assets/screenshot_10.png";
    }
      else if (weatherObj.icon === "01n") {
        return "./assets/screenshot_12.png";
      }
    }
    else if(weatherObj.id === 801) { 
      return "./assets/screenshot.png";
    }
    else if(weatherObj.id === 802) { 
      return "./assets/screenshot_1.png";
    }

    else if(weatherObj.id === 803 || weatherObj.id === 804) { 
      return "./assets/screenshot_2.png";
    }

  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



parseInput(input: string) {

  if(input === "") {
    this.getWeatherWithTimeout(this.weatherState.place,this.weatherState.country);
  } else {
  let regex = RegExp('.+,.+');

  if (input && regex.test(input) ) {
  let strArr = input.split(",");
  this.getWeatherWithTimeout(strArr[0],strArr[1]);
  } else {
    this.searchInputInvalid = true;
  }

}


}


onKeydown(event) {
  if (event.key === "Enter") {
    this.parseInput(this.formInput);
  }
}





  
}

