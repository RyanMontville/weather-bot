import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Weather, Hourly, Daily } from '../weather.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weather: Weather = new Weather();
  city: string = 'Orlando';
  dayZeroHourly: Hourly[] = [];
  dayOneHourly: Hourly[] = [];
  dayTwoHourly: Hourly[] = [];
  dayThreeHourly: Hourly[] = [];
  dayFourHourly: Hourly[] = [];
  dayFiveHourly: Hourly[] = [];
  daySixHourly: Hourly[] = [];
  days: Daily[] = [];
  query: string = '';
  output: {text: string, class: string}[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<Weather>('https://api.open-meteo.com/v1/forecast?latitude=28.54&longitude=-81.38&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York').subscribe(data => {
      if(data.latitude) {
        this.weather.setLatitude(data.latitude);
      } else {
        this.weather.setLatitude(0.000000);
      }
      if(data.longitude) {
        this.weather.setLongitude(data.longitude);
      } else {
        this.weather.setLongitude(0.000);
      }
      if(data.hourly) {
        let startStop = [{start:0,stop:24,day:this.dayZeroHourly},{start:24,stop:48,day:this.dayOneHourly},{start:48,stop:72,day:this.dayTwoHourly},{start:72,stop:96,day:this.dayThreeHourly},{start:96,stop:120,day:this.dayFourHourly},{start:120,stop:144,day:this.dayFiveHourly},{start:144,stop:168,day:this.daySixHourly}];
        for (let j=0;j<startStop.length;j++){
          let hourOfDay: number = 0;
          for(let i=startStop[j].start;i<startStop[j].stop;i++) {
            let hour = new Hourly(hourOfDay,data.hourly.temperature_2m[i],data.hourly.relativehumidity_2m[i],data.hourly.apparent_temperature[i],data.hourly.precipitation[i],data.hourly.weathercode[i]);
            startStop[j].day.push(hour);
            hourOfDay++;
          }
        }
      }
      if(data.daily) {
        this.weather.setDaily(data.daily);
        for(let i=0;i<7;i++) {
          this.days.push(new Daily(data.daily.time[i],data.daily.weathercode[i],data.daily.temperature_2m_max[i],data.daily.temperature_2m_min[i],data.daily.sunrise[i],data.daily.sunset[i],data.daily.uv_index_max[i],data.daily.precipitation_sum[i]));
        }
      }
    });
  }

  getIcon(weathercode: number): string {
    switch(weathercode){
      case 0: {return 'fa-sun'; break;}
      case 1: {return 'fa-sun'; break;}
      case 2: {return 'fa-cloud-sun'; break;}
      case 3: {return 'fa-cloud'; break;}
      case 45: {return 'fa-smog';break;}
      case 48: {return 'fa-smog';break;}
      case 51: {return 'fa-cloud-rain';break;}
      case 53: {return 'fa-cloud-rain';break;}
      case 55: {return 'fa-cloud-rain';break;}
      case 56: {return 'fa-cloud-rain';break;}
      case 57: {return 'fa-cloud-rain';break;}
      case 61: {return 'fa-cloud-showers-heavy';break;}
      case 63: {return 'fa-cloud-showers-heavy';break;}
      case 65: {return 'fa-cloud-showers-heavy';break;}
      case 66: {return 'fa-cloud-showers-heavy';break;}
      case 67: {return 'fa-cloud-showers-heavy';break;}
      case 80: {return 'fa-cloud-showers-heavy';break;}
      case 81: {return 'fa-cloud-showers-heavy';break;}
      case 82: {return 'fa-cloud-showers-heavy';break;}
      case 71: {return 'fa-snowflake';break;}
      case 73: {return 'fa-snowflake';break;}
      case 75: {return 'fa-snowflake';break;}
      case 77: {return 'fa-snowflake';break;}
      case 85: {return 'fa-snowflake';break;}
      case 86: {return 'fa-snowflake';break;}
      case 95: {return 'fa-bolt';break;}
      case 96: {return 'fa-bolt';break;}
      case 99: {return 'fa-bolt';break;}
      default: {return 'fa-circle-question';break}
    }
  }

  conditionAsText(weathercode: number): string {
    switch(weathercode){
      case 0: {return 'clear sky'; break;}
      case 1: {return 'mainly clear'; break;}
      case 2: {return 'partly cloudy'; break;}
      case 3: {return 'overcast'; break;}
      case 45: {return 'fog';break;}
      case 48: {return 'depositing rime fog';break;}
      case 51: {return 'light drizzle';break;}
      case 53: {return 'moderate drizzle';break;}
      case 55: {return 'dense drizzle';break;}
      case 56: {return 'light freezing drizzle';break;}
      case 57: {return 'dense freezing drizzle';break;}
      case 61: {return 'slight rain';break;}
      case 63: {return 'moderate rain';break;}
      case 65: {return 'heavy rain';break;}
      case 66: {return 'freezing rain';break;}
      case 67: {return 'freezing rain';break;}
      case 80: {return 'light rain showers';break;}
      case 81: {return 'moderate rain showers';break;}
      case 82: {return 'heavy rain showers';break;}
      case 71: {return 'light snow fall';break;}
      case 73: {return 'moderate snow fall';break;}
      case 75: {return 'heavy snow fall';break;}
      case 77: {return 'snow grains';break;}
      case 85: {return 'light snow showers';break;}
      case 86: {return 'heavy snow showers';break;}
      case 95: {return 'thunderstorms';break;}
      case 96: {return 'thunderstorms with light hail';break;}
      case 99: {return 'thunderstorms with heavy hail';break;}
      default: {return 'unknown';break}
    }
  }

  onSubmit() {
    this.output.push({text: this.query, class: 'right'});
    let queryL = this.query.toLocaleLowerCase();
    let outputText: string = '';
    if(queryL.includes('max')){
      outputText = outputText + 'Today\'s max will be ' + this.days[0].temperature_2m_max + 'F. ';
    }
    if(queryL.includes('min')){
      outputText = outputText + 'Today\'s min will be ' + this.days[0].temperature_2m_min + 'F. ';
    }
    if(queryL.includes('current')){
      outputText = outputText + this.current(queryL);
    }
    if(outputText != '') {
      this.output.push({text: outputText, class: 'left'});
    } else {
      this.output.push({text: 'Sorry, I don\'t understand. Please try rephrasing.', class: 'left'});
    }
    this.query = '';
  }

  current(input: string) {
    let output = '';
    if(input.includes('temp')){
      return 'The current temperature is ' + this.dayZeroHourly[4].temperature_2m + 'F. ';
    }
    if(input.includes('condition')) {
      return 'It is currently ' + this.conditionAsText(this.dayZeroHourly[4].weathercode) + '. ';
    }
    if(input.includes('precip')) {
      return 'There is currently a ' + this.dayZeroHourly[4].precipitation + '% chance of precipitation. '
    }
    if(input.includes('humid')) {
      return 'The current humidity is ' + this.dayZeroHourly[4].relativehumidity_2m + '%. '
    }
    if(input.includes('feel')) {
      return 'It currently feels like it is ' + this.dayZeroHourly[4].apparent_temperature + 'F. '
    }
    return 'The current temperature is ' + this.dayZeroHourly[4].temperature_2m + 'F, and ' + this.conditionAsText(this.dayZeroHourly[4].weathercode) + ' but it feels like ' + this.dayZeroHourly[4].apparent_temperature + 'F. The humidity is ' + this.dayZeroHourly[4].relativehumidity_2m + '%. '
  }

}
