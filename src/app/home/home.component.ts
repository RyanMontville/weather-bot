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
  currentDay: number = 0;
  week: string[] = [];

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
    let date = new Date();
    this.currentDay = date.getDay();
    switch(this.currentDay){
      case 0: {this.week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];break;}
      case 1: {this.week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];break;}
      case 2: {this.week = ['Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday'];break;}
      case 3: {this.week = ['Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday'];break;}
      case 4: {this.week = ['Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday'];break;}
      case 5: {this.week = ['Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'];break;}
      default: {this.week = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];break;}
    }
  }



  getCondition(weathercode: number,text: boolean): string {
    switch(weathercode){
      case 0: {return (text? 'clear sky':'fa-sun'); break;}
      case 1: {return (text? 'mainly clear':'fa-sun'); break;}
      case 2: {return (text? 'partly cloudy':'fa-cloud-sun'); break;}
      case 3: {return (text? 'overcast':'fa-cloud'); break;}
      case 45: {return (text? 'fog':'fa-smog');break;}
      case 48: {return (text? 'depositing rime fog':'fa-smog');break;}
      case 51: {return (text? 'light drizzle':'fa-cloud-rain');break;}
      case 53: {return (text? 'moderate drizzle':'fa-cloud-rain');break;}
      case 55: {return (text? 'dense drizzle':'fa-cloud-rain');break;}
      case 56: {return (text? 'light freezing drizzle':'fa-cloud-rain');break;}
      case 57: {return (text? 'dense freezing drizzle':'fa-cloud-rain');break;}
      case 61: {return (text? 'slight rain':'fa-cloud-showers-heavy');break;}
      case 63: {return (text? 'moderate rain':'fa-cloud-showers-heavy');break;}
      case 65: {return (text? 'heavy rain':'fa-cloud-showers-heavy');break;}
      case 66: {return (text? 'freezing rain':'fa-cloud-showers-heavy');break;}
      case 67: {return (text? 'freezing rain':'fa-cloud-showers-heavy');break;}
      case 80: {return (text? 'light rain showers':'fa-cloud-showers-heavy');break;}
      case 81: {return (text? 'moderate rain showers':'fa-cloud-showers-heavy');break;}
      case 82: {return (text? 'heavy rain showers':'fa-cloud-showers-heavy');break;}
      case 71: {return (text? 'light snow fall':'fa-snowflake');break;}
      case 73: {return (text? 'moderate snow fall':'fa-snowflake');break;}
      case 75: {return (text? 'heavy snow fall':'fa-snowflake');break;}
      case 77: {return (text? 'snow grains':'fa-snowflake');break;}
      case 85: {return (text? 'light snow showers':'fa-snowflake');break;}
      case 86: {return (text? 'heavy snow showers':'fa-snowflake');break;}
      case 95: {return (text? 'thunderstorms':'fa-bolt');break;}
      case 96: {return (text? 'thunderstorms with light hail':'fa-bolt');break;}
      case 99: {return (text? 'thunderstorms with heavy hail':'fa-bolt');break;}
      default: {return (text? 'unknown':'fa-circle-question');break}
    }
  }

  onSubmit() {
    this.output.push({text: this.query, class: 'right'});
    let queryL = this.query.toLocaleLowerCase();
    let outputText: string = '';
    if(queryL.includes('wall of text')){
      outputText = this.wallOfText();
    }
    if(queryL.includes('day is it')) {
      let day = '';
      switch(this.currentDay) {
        case 0: day = 'Sunday';break;
        case 1: day = 'Monday';break;
        case 2: day = 'Tuesday';break;
        case 3: day = 'Wednesday';break;
        case 4: day = 'Thursday';break;
        case 5: day = 'Friday';break;
        default: day = 'Saturday';break;
      }
      outputText = outputText + 'Today is ' + day + '. '
    }
    if(queryL.includes('today')){
      outputText = outputText + this.today(queryL);
    }
    if(queryL.includes('tomorrow')){
      outputText = outputText + this.tomorrow(queryL);
    }
    if(queryL.includes('current') || queryL.includes('this hour')){
      outputText = outputText + this.current(queryL);
    }
    if(!queryL.includes('tomorrow') && !queryL.includes('current') && !queryL.includes('today')){
      if(queryL.includes('max')){
        outputText = outputText + 'Today\'s max will be ' + this.days[0].temperature_2m_max + 'F. ';
      }
      if(queryL.includes('min')){
        outputText = outputText + 'Today\'s min will be ' + this.days[0].temperature_2m_min + 'F. ';
      }
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
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    if(input.includes('temp')){
      return 'The current temperature is ' + this.dayZeroHourly[currentHour].temperature_2m + 'F. ';
    }
    if(input.includes('condition')) {
      return 'It is currently ' + this.getCondition(this.dayZeroHourly[currentHour].weathercode,true) + '. ';
    }
    if(input.includes('precip')) {
      return 'There is currently a ' + this.dayZeroHourly[currentHour].precipitation + '% chance of precipitation. '
    }
    if(input.includes('humid')) {
      return 'The current humidity is ' + this.dayZeroHourly[currentHour].relativehumidity_2m + '%. '
    }
    if(input.includes('feel')) {
      return 'It currently feels like it is ' + this.dayZeroHourly[currentHour].apparent_temperature + 'F. '
    }
    return 'The current temperature is ' + this.dayZeroHourly[currentHour].temperature_2m + 'F, and ' + this.getCondition(this.dayZeroHourly[currentHour].weathercode,true) + ' but it feels like ' + this.dayZeroHourly[currentHour].apparent_temperature + 'F. The humidity is ' + this.dayZeroHourly[currentHour].relativehumidity_2m + '%. '
  }

  tomorrow(input: string) {
    if(input.includes('what is tomorrow')){
      return 'Tomorrow will be ' + this.week[1] + '.';
    }
    if(input.includes('max')){
      return 'The max tomorrow will be ' + this.days[1].temperature_2m_max + 'F.';
    } else if(input.includes('min')){
      return 'The min tomorrow will be ' + this.days[1].temperature_2m_min + 'F.';
    } else if(input.includes('weather')){
      return 'Tomorrow forecast includes ' + this.getCondition(this.days[1].weathercode,true) + '.';
    }
    if(input.includes('temp')){
      return 'Tomorrow will have a high of ' + this.days[1].temperature_2m_max + 'F and a low of ' + this.days[1].temperature_2m_min + 'F.';
    }
    if(input.includes('precip')){
      return 'There is a ' + this.days[1].precipitation_sum + '% of showers tomorrow.'
    }
    if(input.includes('sunrise')){
      const tomDate = new Date(this.days[1].sunrise);
      return 'Sunrise will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + ' tomorrow.';
    }
    if(input.includes('sunset')){
      const tomDate = new Date(this.days[1].sunset);
      return 'Sunset will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + ' tomorrow.';
    }
    if(input.includes('uv index')){
      return 'Tomorrow\'s UV index will be ' + this.days[1].uv_index_max;
    }
    return 'Tomorrow forecast includes ' + this.getCondition(this.days[1].weathercode,true) + ' with a high of ' + this.days[1].temperature_2m_max + 'F and a low of ' + this.days[1].temperature_2m_min + 'F. There is a ' + this.days[1].precipitation_sum + '% of showers.';
  }

  today(input: string) {
    if(input.includes('max')){
      return 'Today\'s max temperature will be ' + this.days[0].temperature_2m_max + 'F.';
    } else if(input.includes('min')){
      return 'Today\'s min temperature tomorrow will be ' + this.days[0].temperature_2m_min + 'F.';
    } else if(input.includes('weather')){
      return 'Today\'s forecast includes ' + this.getCondition(this.days[0].weathercode,true) + '.';
    }
    if(input.includes('temp')){
      return 'Today will have a high of ' + this.days[0].temperature_2m_max + 'F and a low of ' + this.days[0].temperature_2m_min + 'F.';
    }
    if(input.includes('precip')){
      return 'There is a ' + this.days[0].precipitation_sum + '% of showers.'
    }
    if(input.includes('sunrise')){
      const tomDate = new Date(this.days[0].sunrise);
      return 'Sunrise will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + '.';
    }
    if(input.includes('sunset')){
      const tomDate = new Date(this.days[0].sunset);
      return 'Sunset will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + '.';
    }
    if(input.includes('uv index')){
      return 'Tomorrow\'s UV index will be ' + this.days[0].uv_index_max;
    }
    return 'Todays forecast includes ' + this.getCondition(this.days[0].weathercode,true) + ' with a high of ' + this.days[0].temperature_2m_max + 'F and a low of ' + this.days[0].temperature_2m_min + 'F. There is a ' + this.days[0].precipitation_sum + '% of showers.';
  }

  wallOfText() {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  }

}
