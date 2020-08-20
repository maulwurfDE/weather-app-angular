import { Transform, Expose, Type } from 'class-transformer';

export class Forecast {
    @Expose()
    @Transform( () =>  new Date() )
    date: Date = new Date();

    @Expose()
    @Transform( (value, obj) =>  value.all )
    clouds: number;

    @Expose()
    @Transform( (value, obj) =>  obj.sys.country )
    country: string;

    @Expose()
    @Transform( (value, obj) =>  obj.main.humidity )
    humidity: number;

    @Expose()
    @Transform( (value, obj) =>  obj.weather[0].icon )
    icon: string;

    @Expose()
    @Transform( (value, obj) =>  obj.weather[0].id )
    id: number;

    @Expose()
    @Transform( (value, obj) =>  obj.name )
    place: string;

    @Expose()
    @Transform( (value, obj) =>  Math.round(obj.main.temp) )
    temp: number;

    @Expose()
    @Transform( (value, obj) =>  {
        // capitalize first letter of every word
        let splitStr = obj.weather[0].description.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' ');
    })
    weatherDesc: string;

    @Expose()
    @Transform( (value, obj) => value.speed )
    wind: number;

    @Expose()
    @Type(() => Outlook)
    futureForecasts: Outlook[];

    constructor() {}

    getWind(unit: 'metric' | 'imperial'): number {
        if (unit === 'metric') {
            return Math.round((this.wind * 60 * 60) / 1000);
        } else {
            return Math.round(this.wind);
        }
    }

}

export class Outlook {
    @Expose()
    @Transform( (value, obj) => obj.weather[0].id)  
    id: number;

    @Expose()
    @Transform( (value, obj) => obj.weather[0].icon)  
    icon: string;
    
    @Expose()  
    @Transform( (value, obj) => new Date(obj.dt * 1000))  
    date: Date;

    @Expose()
    @Transform( (value, obj) => Math.round(obj.temp.min))  
    minTemp: number;

    @Expose()
    @Transform( (value, obj) => Math.round(obj.temp.max))  
    maxTemp: number;

    getMean(): number {
        return (this.maxTemp + this.minTemp) / 2
    }
}