import { Component, OnChanges, ChangeDetectorRef, Input, SimpleChanges, OnInit } from '@angular/core';
import { faSync, faCloud, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTint, faWind } from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Forecast } from './forecast.class';
import { plainToClass } from 'class-transformer';
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  faSync = faSync;
  faTint = faTint;
  faWind = faWind;
  faCloud = faCloud;
  faSearch = faSearch;
  formCity = "Santa Barbara";
  formInput: string;
  formCountry = "US";
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
  searchPlaceholder: string = "Santa Barbara, US";
  wind: number;
  searchInputInvalidText: string = "Please enter \'town<strong>,</strong> country\'. Don\'t forget the comma.";
  location: any;

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };


  constructor(private http: HttpClient) { 

  
  }


  ngOnInit() {

        
  navigator.geolocation.getCurrentPosition(
    (pos) => this.getTown(pos.coords.latitude, pos.coords.longitude),
    (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      this.searchInputInvalidText = "GeoIP failed. Please input your city and country."
      setTimeout(() => this.searchInputInvalid = true, 500);
      this.getWeatherWithTimeout("Santa Barbara","US");
    },
    this.options
    )


  }
  

async getTown(lat,lon) {

  this.reloadSpinner = true;

  const oneCallResponse = await this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.appId}&units=${this.units}`).toPromise(); 

  await this.getWeatherWithTimeout(oneCallResponse['name'], oneCallResponse['sys'].country);

}


  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
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
    const response = await this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=${environment.appId}&units=${this.units}`).toPromise(); //await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town},${country}&APPID=10e913130e75c308b518d5e8710fb645&units=${this.units}`);
    const weatherData = response; //await response.json();
    
    return weatherData;
  } catch (err) {
    console.log(err);
    if(err.statusText === "Not Found") {
      this.searchInputInvalidText = "The town was not found. Please change your input."
    };
    this.searchInputInvalid = true;
    return undefined;
  }

  
}


  async processResponse(town, country) {


      
      let weatherData: any = await this.getWeather(town,country);
  
      if(weatherData) {
        
        const oneCallResponse = await this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,minutely,hourly&appid=${environment.appId}&units=${this.units}`).toPromise(); 
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
    let pathVariable;

    if(idFirstDigit === '2') { pathVariable = "3"; } 
    else if (idFirstDigit === '3') {
      pathVariable = "7";
    }
    else if(weatherObj.id === 500 || weatherObj === 501) {
      pathVariable = "4";
    }
    else if(idFirstDigit === '5') {
      pathVariable = "5";
    }
    else if(idFirstDigit === '6') {
      pathVariable = "6";
    }
    else if(idFirstDigit === '7') {
      pathVariable = "13";
    }
    else if(weatherObj.id === 800) {
      if(weatherObj.icon === "01d") {
      pathVariable = "10";
    }
      else if (weatherObj.icon === "01n") {
        pathVariable = "12";
      }
    }
    else if(weatherObj.id === 801) { 
      pathVariable = "0";
    }
    else if(weatherObj.id === 802) { 
      pathVariable = "1";
    }

    else if(weatherObj.id === 803 || weatherObj.id === 804) { 
      pathVariable = "2";
    }

    let path = "./assets/";
    let png = ".png";

    return  path + pathVariable + png;
    

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
    this.searchInputInvalidText = `Please enter \'town, country\'. Don\'t forget the comma.`;
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

