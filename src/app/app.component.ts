import { Component, OnChanges, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import {spinnerWorks} from "./import.js"
import { faSync, faCloud, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
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
  formCity: String = "Münster";
  formInput: String;

  formCountry: String = "DE";
  weatherState: any = "Nothing searched yet!";
  reloadSpinner: boolean = false;
  filtered: any;
  letterCelsius: boolean = true;
  units: string = "metric";
  mainWeatherImg: string;
  onedayWeatherImg: string;
  twodayWeatherImg: string;
  threedayWeatherImg: string;
  weatherForcast: any[] = [];
  showInput: boolean = false;
  searchInputInvalid: boolean = false;
  searchPlaceholder: string = "Münster, DE";

   // Write the functions that hit the API. You’re going to want functions that can take a location and return the weather data for that location. For now, just console.log() the information.

  constructor(private http: HttpClient) {
    // this.getWeather("münster","germany");
    // this.getWeather("Münster","Germany");
    this.processResponse("Münster","Germany");
  }



  searchIconFunction() {
    if(this.showInput === false ) {
      this.showInput = true;
    } else {
      this.parseInput(this.formInput);
    }

  }

  async getWeather(town,country) {
    // spinnerWorks.spin(document.getElementById('container'));
    this.searchInputInvalid = false;
    this.reloadSpinner = true;

  try {
    const response = await this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=10e913130e75c308b518d5e8710fb645&units=${this.units}`).toPromise(); //await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=10e913130e75c308b518d5e8710fb645&units=${this.units}`);
    const weatherData = response; //await response.json();
    console.log('weatherData', weatherData);
    return weatherData;
  } catch (err) {
    console.log(err);
    this.searchInputInvalid = true;
    return undefined;
  }

  
}


 async processResponse(town, country) {

  let weatherData: any = await this.getWeather(town,country);
   console.log("test2");
   
  if(weatherData) {
 

    console.log(weatherData);

    let weatherArr = {clouds: weatherData.clouds.all, temp: weatherData.main.temp, place: weatherData.name, country: weatherData.sys.country, weatherDesc: weatherData.weather[0].description, id: weatherData.weather[0].id, icon: weatherData.weather[0].icon, wind: weatherData.wind.speed, humidity: weatherData.main.humidity}

  

    this.weatherState = weatherArr;
    if(this.units === "metric") {
      this.weatherState.wind = Math.round((this.weatherState.wind*60*60)/1000);
    }
    else if(this.units === "imperial") {
      this.weatherState.wind = Math.round(this.weatherState.wind);
    }

    
    this.weatherState.temp = Math.round(this.weatherState.temp);
    this.weatherState.weatherDesc = this.titleCase(this.weatherState.weatherDesc);

    this.mainWeatherImg = this.getWeatherImage(this.weatherState);


    const oneCallResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,minutely,hourly&appid=10e913130e75c308b518d5e8710fb645&units=${this.units}`)

    const oneCallData = await oneCallResponse.json();

    let oneCallDataArr = [
      {
        tempMax: Math.round(oneCallData.daily[0].temp.max), tempMin: Math.round(oneCallData.daily[0].temp.min), id: oneCallData.daily[0].weather[0].id, date: oneCallData.daily[0].dt, icon: oneCallData.daily[0].weather[0].icon 
      }, 
      {
        tempMax: Math.round(oneCallData.daily[1].temp.max), tempMin: Math.round(oneCallData.daily[1].temp.min), id: oneCallData.daily[1].weather[0].id, date: oneCallData.daily[1].dt, icon: oneCallData.daily[1].weather[0].icon 
      },
      {
        tempMax: Math.round(oneCallData.daily[2].temp.max), tempMin: Math.round(oneCallData.daily[2].temp.min), id: oneCallData.daily[2].weather[0].id, date: oneCallData.daily[2].dt, icon: oneCallData.daily[2].weather[0].icon 
      }
  ]

    this.weatherForcast = oneCallDataArr;
    console.log(oneCallData);
    this.onedayWeatherImg = this.getWeatherImage(oneCallDataArr[0]);
    this.twodayWeatherImg = this.getWeatherImage(oneCallDataArr[1]);
    this.threedayWeatherImg = this.getWeatherImage(oneCallDataArr[2]);
    // spinnerWorks.stop();
    
    // console.log(weatherData);



    
    this.showInput=false;
    await this.timeout(2000);

  }
    this.searchPlaceholder = this.weatherState.place + ", " + this.weatherState.country; 
    this.formInput = "";
    // let myContainer: HTMLLinkElement | null = document.querySelector("#appIcon");
    // myContainer.href = "http://openweathermap.org/img/w/" + this.weatherState.icon + ".png";
    this.reloadSpinner = false;



  }

  

  getWeatherImage(weatherObj) {

    console.log(weatherObj);
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
      console.log("test" + weatherObj.icon);
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


titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}


parseInput(string) {
  let strArr = string.split(",");
  console.log(strArr);
  this.processResponse(strArr[0],strArr[1]);

}


onKeydown(event) {
  if (event.key === "Enter") {
    this.parseInput(this.formInput);
  }



}



  
}
