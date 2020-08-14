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

    // spinnerWorks.stop();
    
    // console.log(weatherData);


    let weatherArr = {clouds: weatherData.clouds.all, temp: weatherData.main.temp, place: weatherData.name, country: weatherData.sys.country, weatherDesc: weatherData.weather[0].description, id: weatherData.weather[0].id, icon: weatherData.weather.icon}

  
    this.weatherState = weatherArr;
    this.weatherState.temp = Math.round(this.weatherState.temp);
    this.weatherState.weatherDesc = this.titleCase(this.weatherState.weatherDesc)
    
    console.log(weatherData.weather[0].id)
    let idFirstDigit = this.weatherState.id.toString().charAt(0);
    
    if(idFirstDigit === '2') { this.mainWeatherImg = "./../assets/screenshot_3.png"; } 
    else if (idFirstDigit === '3') {
      this.mainWeatherImg = "./../assets/screenshot_7.png";
    }
    else if(this.weatherState.id === 500 || this.weatherState.id === 501) {
      this.mainWeatherImg = "./../assets/screenshot_4.png";
    }
    else if(idFirstDigit === '5') {
      this.mainWeatherImg = "./../assets/screenshot_5.png";
    }
    else if(idFirstDigit === '6') {
      this.mainWeatherImg = "./../assets/screenshot_6.png";
    }
    else if(idFirstDigit === '7') {
      this.mainWeatherImg = "./../assets/screenshot_13.png";
    }
    else if(this.weatherState.id === 800) {
      if(this.weatherState.icon === "01d") {
      this.mainWeatherImg = "./../assets/screenshot_10.png"}
      else if (this.weatherState.icon === "01n") {
        this.mainWeatherImg = "./../assets/screenshot_12.png";
      };
    }
    else if(this.weatherState.id === 801) { 
      this.mainWeatherImg = "./../assets/screenshot.png";
    }
    else if(this.weatherState.id === 802) { 
      this.mainWeatherImg = "./../assets/screenshot_1.png";
    }

    else if(this.weatherState.id === 803 || this.weatherState.id === "804") { 
      this.mainWeatherImg = "./../assets/screenshot_2.png";
    }


    
    

    await this.timeout(1000);

    this.reloadSpinner = false;



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
