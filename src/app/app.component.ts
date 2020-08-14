import { Component, OnChanges } from '@angular/core';
import {spinnerWorks} from "./import.js"
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { faTint, faWind } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faSync = faSync;
  faTint = faTint;
  faWind = faWind;
  formCity: String;
  formCountry: String;
  weatherState: any = "Nothing searched yet!";
  reloadSpinner: boolean = false;
  filtered: any;
  letterCelsius: boolean = true;
  units: string = "metric";
  mainWeatherImg: string = "./../assets/screenshot.png";
  onedayWeatherImg: string;
  twodayWeatherImg: string;
  threedayWeatherImg: string;
  weatherForcast: any[] = [];
   // Write the functions that hit the API. You’re going to want functions that can take a location and return the weather data for that location. For now, just console.log() the information.

  constructor() {
    // this.getWeather("münster","germany");

    this.getWeather("Münster","Germany");
 
 


  }




  async getWeather(town,country) {
    // spinnerWorks.spin(document.getElementById('container'));
    this.reloadSpinner = true;
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=10e913130e75c308b518d5e8710fb645&units=${this.units}`);

    const weatherData = await response.json();

  


    let weatherArr = {clouds: weatherData.clouds.all, temp: weatherData.main.temp, place: weatherData.name, country: weatherData.sys.country, weatherDesc: weatherData.weather[0].description, id: weatherData.weather[0].id, icon: weatherData.weather.icon}

  
    this.weatherState = weatherArr;
    this.weatherState.temp = Math.round(this.weatherState.temp);
    this.weatherState.weatherDesc = this.titleCase(this.weatherState.weatherDesc);

    this.mainWeatherImg = this.getWeatherImage(this.weatherState);


    const oneCallResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,minutely,hourly&appid=10e913130e75c308b518d5e8710fb645&units=${this.units}`)

    const oneCallData = await oneCallResponse.json();

    let oneCallDataArr = [
      {
        tempMax: Math.round(oneCallData.daily[0].temp.max), tempMin: Math.round(oneCallData.daily[0].temp.min), id: oneCallData.daily[0].weather[0].id, date: oneCallData.daily[0].dt
      }, 
      {
        tempMax: Math.round(oneCallData.daily[1].temp.max), tempMin: Math.round(oneCallData.daily[1].temp.min), id: oneCallData.daily[1].weather[0].id, date: oneCallData.daily[1].dt
      },
      {
        tempMax: Math.round(oneCallData.daily[2].temp.max), tempMin: Math.round(oneCallData.daily[2].temp.min), id: oneCallData.daily[2].weather[0].id, date: oneCallData.daily[2].dt
      }
  ]

    this.weatherForcast = oneCallDataArr;
    console.log(oneCallData);
    this.onedayWeatherImg = this.getWeatherImage(oneCallDataArr[0]);
    this.twodayWeatherImg = this.getWeatherImage(oneCallDataArr[1]);
    this.threedayWeatherImg = this.getWeatherImage(oneCallDataArr[2]);
    // spinnerWorks.stop();
    
    // console.log(weatherData);



    

    // await this.timeout(1000);

    this.reloadSpinner = false;



  }

  getWeatherImage(weatherObj) {


    let idFirstDigit = weatherObj.id.toString().charAt(0);
    
    if(idFirstDigit === '2') { return "./../assets/screenshot_3.png"; } 
    else if (idFirstDigit === '3') {
      return "./../assets/screenshot_7.png";
    }
    else if(weatherObj.id === 500 || weatherObj === 501) {
      return "./../assets/screenshot_4.png";
    }
    else if(idFirstDigit === '5') {
      return "./../assets/screenshot_5.png";
    }
    else if(idFirstDigit === '6') {
      return "./../assets/screenshot_6.png";
    }
    else if(idFirstDigit === '7') {
      return "./../assets/screenshot_13.png";
    }
    else if(weatherObj.id === 800) {
      if(weatherObj.icon === "01d") {
      return "./../assets/screenshot_10.png"}
      else if (weatherObj.icon === "01n") {
        return "./../assets/screenshot_12.png";
      };
    }
    else if(weatherObj.id === 801) { 
      return "./../assets/screenshot.png";
    }
    else if(weatherObj.id === 802) { 
      return "./../assets/screenshot_1.png";
    }

    else if(weatherObj.id === 803 || weatherObj.id === "804") { 
      return "./../assets/screenshot_2.png";
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




  
}
