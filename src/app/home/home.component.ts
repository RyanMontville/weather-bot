import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Weather, Hourly, Daily } from '../weather.model';
import { Location } from '../location.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weather: Weather = new Weather();
  location: string = 'Orlando, Fl';
  lat: number = 28.53833;
  long: number = -81.37888;
  dayZeroHourly: Hourly[] = [];
  dayOneHourly: Hourly[] = [];
  dayTwoHourly: Hourly[] = [];
  dayThreeHourly: Hourly[] = [];
  dayFourHourly: Hourly[] = [];
  dayFiveHourly: Hourly[] = [];
  daySixHourly: Hourly[] = [];
  days: Daily[] = [];
  query: string = '';
  output: { text: string, class: string }[] = [{ text: 'Current location is set to Orlando, FL. \nType \"change location\" to update.\nType \"help\" for the current list of supported commands.', class: 'left' }];
  currentDay: number = 0;
  week: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getWeather();
    let date = new Date();
    this.currentDay = date.getDay();
    switch (this.currentDay) {
      case 0: { this.week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; break; }
      case 1: { this.week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; break; }
      case 2: { this.week = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']; break; }
      case 3: { this.week = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday']; break; }
      case 4: { this.week = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']; break; }
      case 5: { this.week = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']; break; }
      default: { this.week = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; break; }
    }
  }

  getWeather() {
    this.weather = new Weather();
    this.dayZeroHourly = [];
    this.dayOneHourly = [];
    this.dayTwoHourly = [];
    this.dayThreeHourly = [];
    this.dayFourHourly = [];
    this.dayFiveHourly = [];
    this.daySixHourly = [];
    this.days = [];

    this.http.get<Weather>(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York`).subscribe(data => {
      if (data.latitude) {
        this.weather.setLatitude(data.latitude);
      } else {
        this.weather.setLatitude(0.000000);
      }
      if (data.longitude) {
        this.weather.setLongitude(data.longitude);
      } else {
        this.weather.setLongitude(0.000);
      }
      if (data.hourly) {
        let startStop = [{ start: 0, stop: 24, day: this.dayZeroHourly }, { start: 24, stop: 48, day: this.dayOneHourly }, { start: 48, stop: 72, day: this.dayTwoHourly }, { start: 72, stop: 96, day: this.dayThreeHourly }, { start: 96, stop: 120, day: this.dayFourHourly }, { start: 120, stop: 144, day: this.dayFiveHourly }, { start: 144, stop: 168, day: this.daySixHourly }];
        for (let j = 0; j < startStop.length; j++) {
          let hourOfDay: number = 0;
          for (let i = startStop[j].start; i < startStop[j].stop; i++) {
            let hour = new Hourly(hourOfDay, data.hourly.temperature_2m[i], data.hourly.relativehumidity_2m[i], data.hourly.apparent_temperature[i], data.hourly.precipitation[i], data.hourly.weathercode[i]);
            startStop[j].day.push(hour);
            hourOfDay++;
          }
        }
      }
      if (data.daily) {
        this.weather.setDaily(data.daily);
        for (let i = 0; i < 7; i++) {
          this.days.push(new Daily(data.daily.time[i], data.daily.weathercode[i], data.daily.temperature_2m_max[i], data.daily.temperature_2m_min[i], data.daily.sunrise[i], data.daily.sunset[i], data.daily.uv_index_max[i], data.daily.precipitation_sum[i]));
        }
      }
    });
  }



  getCondition(weathercode: number, text: boolean): string {
    switch (weathercode) {
      case 0: { return (text ? 'clear sky' : 'fa-sun'); break; }
      case 1: { return (text ? 'mainly clear' : 'fa-sun'); break; }
      case 2: { return (text ? 'partly cloudy' : 'fa-cloud-sun'); break; }
      case 3: { return (text ? 'overcast' : 'fa-cloud'); break; }
      case 45: { return (text ? 'fog' : 'fa-smog'); break; }
      case 48: { return (text ? 'depositing rime fog' : 'fa-smog'); break; }
      case 51: { return (text ? 'light drizzle' : 'fa-cloud-rain'); break; }
      case 53: { return (text ? 'moderate drizzle' : 'fa-cloud-rain'); break; }
      case 55: { return (text ? 'dense drizzle' : 'fa-cloud-rain'); break; }
      case 56: { return (text ? 'light freezing drizzle' : 'fa-cloud-rain'); break; }
      case 57: { return (text ? 'dense freezing drizzle' : 'fa-cloud-rain'); break; }
      case 61: { return (text ? 'slight rain' : 'fa-cloud-showers-heavy'); break; }
      case 63: { return (text ? 'moderate rain' : 'fa-cloud-showers-heavy'); break; }
      case 65: { return (text ? 'heavy rain' : 'fa-cloud-showers-heavy'); break; }
      case 66: { return (text ? 'freezing rain' : 'fa-cloud-showers-heavy'); break; }
      case 67: { return (text ? 'freezing rain' : 'fa-cloud-showers-heavy'); break; }
      case 80: { return (text ? 'light rain showers' : 'fa-cloud-showers-heavy'); break; }
      case 81: { return (text ? 'moderate rain showers' : 'fa-cloud-showers-heavy'); break; }
      case 82: { return (text ? 'heavy rain showers' : 'fa-cloud-showers-heavy'); break; }
      case 71: { return (text ? 'light snow fall' : 'fa-snowflake'); break; }
      case 73: { return (text ? 'moderate snow fall' : 'fa-snowflake'); break; }
      case 75: { return (text ? 'heavy snow fall' : 'fa-snowflake'); break; }
      case 77: { return (text ? 'snow grains' : 'fa-snowflake'); break; }
      case 85: { return (text ? 'light snow showers' : 'fa-snowflake'); break; }
      case 86: { return (text ? 'heavy snow showers' : 'fa-snowflake'); break; }
      case 95: { return (text ? 'thunderstorms' : 'fa-bolt'); break; }
      case 96: { return (text ? 'thunderstorms with light hail' : 'fa-bolt'); break; }
      case 99: { return (text ? 'thunderstorms with heavy hail' : 'fa-bolt'); break; }
      default: { return (text ? 'unknown' : 'fa-circle-question'); break }
    }
  }

  onSubmit() {
    this.output.push({ text: this.query, class: 'right' });
    let queryL = this.query.toLocaleLowerCase();
    let outputText: string = '';
    if (this.location === '') {
      outputText = this.changeLocation(queryL);
    } else {
      if (queryL.includes('change location')) {
        this.location = '';
        this.long = 0;
        this.lat = 0;
        outputText = 'Please enter location (city and state).'
      }
      if(queryL.includes('help')){
        outputText = this.help(queryL);
      }
      if(queryL.includes('exit') || queryL.includes('leave') || queryL.includes('quit')){
        outputText = 'Goodbye.'
        window.location.href='https://www.ryanmontville.com/';
      }
      if (queryL.includes('wall of text')) {
        outputText = this.wallOfText();
      }
      if (queryL.includes('day is it')) {
        let day = '';
        switch (this.currentDay) {
          case 0: day = 'Sunday'; break;
          case 1: day = 'Monday'; break;
          case 2: day = 'Tuesday'; break;
          case 3: day = 'Wednesday'; break;
          case 4: day = 'Thursday'; break;
          case 5: day = 'Friday'; break;
          default: day = 'Saturday'; break;
        }
        outputText = outputText + 'Today is ' + day + '. '
      }
      if (queryL.includes('today')) {
        outputText = outputText + this.todayForecast(queryL);
      }
      if (queryL.includes('tomorrow')) {
        outputText = outputText + this.tomorrowForecast(queryL);
      }
      if (queryL.includes('current') || queryL.includes('this hour')) {
        outputText = outputText + this.current(queryL);
      }
      if(queryL.includes('week') && !queryL.includes('weekend')){
        outputText = outputText + this.weekForecast(queryL);
      }
      if (queryL.includes('weekend')) {
        outputText = outputText + this.weekendForecast(queryL);
      }
      if(queryL.includes('sunday') || queryL.includes('monday') || queryL.includes('tuesday') || queryL.includes('wednesday') || queryL.includes('day') || queryL.includes('thursday') || queryL.includes('friday') || queryL.includes('saturday')) {
        outputText = outputText + this.singleDayForecast(queryL);
      }
      if((queryL.includes(' at ' && 'am')) || (queryL.includes(' at ' && 'pm')) || queryL.includes('hourly')) {
        outputText = outputText + this.hourlyForecast(queryL);
      }
    }

    if (outputText != '') {
      this.output.push({ text: outputText, class: 'left' });
    } else {
      this.output.push({ text: 'Sorry, I don\'t understand. Please try rephrasing or type \"help\" for the current list of supported commands. ', class: 'left' });
    }
    this.query = '';
  }

  changeLocation(input: string): string {
    let numResults = 0;
    this.http.get<Location>(`https://api.tomtom.com/search/2/geocode/${input}.json?storeResult=false&limit=1&view=Unified&key=hTedqMXqNS76l8yGS8HpTpxuNl6tM9g9`).subscribe(async  data => {
      let newLocation: Location = data;
      if (newLocation.summary.numResults > 0) {
        numResults = newLocation.summary.numResults;
        this.location = newLocation.results[0].address.freeformAddress;
        this.lat = newLocation.results[0].position.lat;
        this.long = newLocation.results[0].position.lon;
        this.getWeather();
        this.output.pop();
        this.output.push({text: 'Location changed to ' + this.location, class: 'left' });
      } else {
        this.output.pop();
        this.output.push({text: input + ' not found, please try again.', class: 'left' });
      }
    });
    return 'Updating...';
  }

  help(input: string){
    if(input.includes('location')){
      return 'Location is currently set to ' + this.location + '. Type \"change location\" to update. '
    }
    return 'Current supported commands: \n\n• Current - temperature, weather condition, chance of precipitation, humidity, feels like temperature, forecast \n\n• Today - Will it rain?, max temperature, min temperature, weather condition, chance of precipitation, time of sunrise, time of sunset, uv index, today\'s forecast \n\n• Tomorrow - Will it rain?, max temperature, min temperature, weather condition, chance of precipitation, time of sunrise, time of sunset, uv index, tomorrow\'s forecast \n\n• Week - will it rain?, highest temperature this week, lowest temperature this week, 7 day forecast \n\n• Weekend - Will it rain?, max temperature, min temperature, weather condition, chance of precipitation, weekend forecast \n\n• Hourly - Hourly forecast, Hourly temperature, hourly precipitation, weather at 2pm, temperature at 5am, chance of precipitation at 12pm \n\n• Change location - Currently set to ' + this.location + '\n\n• Exit/Quit - Go back to RyanMontville.com';
  }

  current(input: string) {
    let output = '';
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    if (input.includes('temp')) {
      return 'The current temperature is ' + this.dayZeroHourly[currentHour].temperature_2m + 'F. ';
    }
    if (input.includes('condition')) {
      return 'It is currently ' + this.getCondition(this.dayZeroHourly[currentHour].weathercode, true) + '. ';
    }
    if (input.includes('precip')) {
      return 'There is currently a ' + this.dayZeroHourly[currentHour].precipitation + '% chance of precipitation. '
    }
    if (input.includes('humid')) {
      return 'The current humidity is ' + this.dayZeroHourly[currentHour].relativehumidity_2m + '%. '
    }
    if (input.includes('feel')) {
      return 'It currently feels like it is ' + this.dayZeroHourly[currentHour].apparent_temperature + 'F. '
    }
    return 'The current temperature is ' + this.dayZeroHourly[currentHour].temperature_2m + 'F, and ' + this.getCondition(this.dayZeroHourly[currentHour].weathercode, true) + ' but it feels like ' + this.dayZeroHourly[currentHour].apparent_temperature + 'F. The humidity is ' + this.dayZeroHourly[currentHour].relativehumidity_2m + '%. '
  }

  todayForecast(input: string) {
    if(input.includes('will it rain')){
      if(this.days[0].precipitation_sum>60){
        return 'It might rain today. ';
      } else {
        return 'It probably won\'t rain today. ';
      }
    }
    if (input.includes('max')) {
      return 'Today\'s max temperature will be ' + this.days[0].temperature_2m_max + 'F.';
    } else if (input.includes('min')) {
      return 'Today\'s min temperature tomorrow will be ' + this.days[0].temperature_2m_min + 'F.';
    } else if (input.includes('weather')) {
      return 'Today\'s forecast includes ' + this.getCondition(this.days[0].weathercode, true) + '.';
    }
    if (input.includes('temp')) {
      return 'Today will have a high of ' + this.days[0].temperature_2m_max + 'F and a low of ' + this.days[0].temperature_2m_min + 'F.';
    }
    if (input.includes('precip')) {
      return 'There is a ' + this.days[0].precipitation_sum + '% of showers.'
    }
    if (input.includes('sunrise')) {
      const tomDate = new Date(this.days[0].sunrise);
      return 'Sunrise will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + '.';
    }
    if (input.includes('sunset')) {
      const tomDate = new Date(this.days[0].sunset);
      return 'Sunset will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + '.';
    }
    if (input.includes('uv index')) {
      return 'Tomorrow\'s UV index will be ' + this.days[0].uv_index_max;
    }
    return 'Todays forecast includes ' + this.getCondition(this.days[0].weathercode, true) + ' with a high of ' + this.days[0].temperature_2m_max + 'F and a low of ' + this.days[0].temperature_2m_min + 'F. There is a ' + this.days[0].precipitation_sum + '% of showers.';
  }

  tomorrowForecast(input: string) {
    if (input.includes('what is tomorrow')) {
      return 'Tomorrow will be ' + this.week[1] + '.';
    }
    if(input.includes('will it rain')){
      if(this.days[1].precipitation_sum>60){
        return 'It might rain tomorrow. ';
      } else {
        return 'It probably won\'t rain tomorrow. ';
      }
    }
    if (input.includes('max')) {
      return 'The max tomorrow will be ' + this.days[1].temperature_2m_max + 'F.';
    } else if (input.includes('min')) {
      return 'The min tomorrow will be ' + this.days[1].temperature_2m_min + 'F.';
    } else if (input.includes('weather')) {
      return 'Tomorrow forecast includes ' + this.getCondition(this.days[1].weathercode, true) + '.';
    }
    if (input.includes('temp')) {
      return 'Tomorrow will have a high of ' + this.days[1].temperature_2m_max + 'F and a low of ' + this.days[1].temperature_2m_min + 'F.';
    }
    if (input.includes('precip')) {
      return 'There is a ' + this.days[1].precipitation_sum + '% of showers tomorrow.'
    }
    if (input.includes('sunrise')) {
      const tomDate = new Date(this.days[1].sunrise);
      return 'Sunrise will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + ' tomorrow.';
    }
    if (input.includes('sunset')) {
      const tomDate = new Date(this.days[1].sunset);
      return 'Sunset will be at ' + tomDate.getHours() + ':' + tomDate.getMinutes() + ' tomorrow.';
    }
    if (input.includes('uv index')) {
      return 'Tomorrow\'s UV index will be ' + this.days[1].uv_index_max;
    }
    return 'Tomorrow forecast includes ' + this.getCondition(this.days[1].weathercode, true) + ' with a high of ' + this.days[1].temperature_2m_max + 'F and a low of ' + this.days[1].temperature_2m_min + 'F. There is a ' + this.days[1].precipitation_sum + '% of showers.';
  }

  wallOfText() {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  }

  weekForecast(input: string) {
    if(input.includes('will it rain')){
      let dayWillRain: string[] = [];
      for(let i=0;i<7;i++){
        if(this.days[i].precipitation_sum>59){
          dayWillRain.push(this.week[i]);
        }
      }
      let output: string = '';
      if(dayWillRain.length>0){
      output = 'It will rain ';
      for(let i=0;i<dayWillRain.length-1;i++){
        output = output + dayWillRain[i] + ', ';
      }
      output = output + 'and ' + dayWillRain[dayWillRain.length-1] + ' this week.'
      } else {
        output = 'It probably will not rain this week.';
      }
      return output;
    } else if(input.includes('highest temp')){
        let temp: number = -9999999;
        let day: string = '';
        for(let i=0;i<this.days.length;i++){
          if(this.days[i].temperature_2m_max>temp){
            temp = this.days[i].temperature_2m_max;
            day = this.week[i];
          }
        }
        return 'The highest temperature this week will be ' + temp + 'F on ' + day + '. ';
    } else if(input.includes('lowest temp')) {
      let temp: number = 9999999;
        let day: string = '';
        for(let i=0;i<this.days.length;i++){
          if(this.days[i].temperature_2m_min<temp){
            temp = this.days[i].temperature_2m_min;
            day = this.week[i];
          }
        }
        return 'The lowest temperature this week will be ' + temp + 'F on ' + day + '. ';
    } {
      let output = '';
      output = output + this.week[0] + ': ' + this.days[0].temperature_2m_max + 'F ' + this.getCondition(this.days[0].weathercode, true) + ' ';
      for(let i=1;i<this.days.length;i++){
        output = output + '\n' + this.week[i] + ': ' + this.days[i].temperature_2m_max + 'F ' + this.getCondition(this.days[i].weathercode, true) + ' ';
      }
      return output;
    }
  }

  weekendForecast(input: string) {
    let startOfWeekend: number = this.week.indexOf('Friday');
    let endOfWeekend: number = 0;
    if(startOfWeekend>3){
      endOfWeekend = 6;
    } else {
      endOfWeekend = startOfWeekend + 2;
    }
    if(input.includes('will it rain')){
      let dayWillRain: string[] = [];
      for(let i=startOfWeekend;i<endOfWeekend+1;i++){
        if(this.days[i].precipitation_sum>59){
          dayWillRain.push(this.week[i]);
        }
      }
      let output: string = '';
      if(dayWillRain.length>0){
      output = 'It will rain ';
      for(let i=0;i<dayWillRain.length-1;i++){
        output = output + dayWillRain[i] + ', ';
      }
      output = output + 'and ' + dayWillRain[dayWillRain.length-1] + ' this weekend.'
      } else {
        output = 'It probably will not rain this weekend.';
      }
      return output;
    } else if (input.includes('temp')) {
      let output = ''
      for(let i=startOfWeekend;i<endOfWeekend;i++){
        output = output + this.week[i] + ' will have a high of ' + this.days[i].temperature_2m_max + 'F.\n';
      }
      output = output + this.week[endOfWeekend] + ' will have a high of ' + this.days[endOfWeekend].temperature_2m_max + 'F. ';
      return output;
    } else if (input.includes('precip')) {
      let output = ''
      for(let i=startOfWeekend;i<endOfWeekend;i++){
        output = output + this.week[i] + ' has a ' + this.days[i].precipitation_sum + '% chance of showers.\n';
      }
      output = output + this.week[endOfWeekend] + ' has a ' + this.days[endOfWeekend].precipitation_sum + '% chance of showers. ';
      return output;
    } else if(input.includes('uv index')){
      let output = ''
      for(let i=startOfWeekend;i<endOfWeekend;i++){
        output = output + this.week[i] + ' will have an index of ' + this.days[i].uv_index_max + '. ';
      }
      output = output + this.week[endOfWeekend] + ' will have an index of ' + this.days[endOfWeekend].uv_index_max + '. ';
      return output;
    } else {
      let output = ''
      for(let i=startOfWeekend;i<endOfWeekend;i++){
        output = output + this.week[i] + ': ' + this.days[i].temperature_2m_max + 'F and ' + this.getCondition(this.days[i].weathercode, true) + ', precipitation ' + this.days[i].precipitation_sum + '%\n';
      }
      output = output + this.week[endOfWeekend] + ': ' + this.days[endOfWeekend].temperature_2m_max + 'F and ' + this.getCondition(this.days[endOfWeekend].weathercode, true) + ', precipitation ' + this.days[endOfWeekend].precipitation_sum + '% ';
      return output;
    }
  }

  hourlyForecast(input: string) {
    let hour: number = 0;
    let hourStr: string = '';
    if((!input.includes('am')) || (!input.includes('pm'))){
      hour = parseInt(input.replace(/\D/g, ''));
    if(input.includes(hour + 'pm') || input.includes(hour+' pm')){
      if(hour>12){
        return 'Please enter time as #am or #pm (# am also supported).';
      }
      hourStr = hour + 'pm';
      hour = hour + 12;
    } else if(input.includes(hour+'am')|| input.includes(hour+' am')) {
      if(hour>12){
        return 'Please enter time as #am or #pm (# am also supported).';
      }
      hourStr = hour + 'am';
    }
    }
    if((input.includes('temp') && input.includes('am')) || (input.includes('temp') && input.includes('pm'))){
      return 'It will be ' + this.dayZeroHourly[hour].temperature_2m + 'F with a feel like of ' + this.dayZeroHourly[hour].apparent_temperature + 'F at ' + hourStr + '. ';
    } else if(input.includes('hourly precip')) {
      let output: string = '';
      output = output + this.dayZeroHourly[0].precipitation + '% at ' + 0;
      for(let i=1;i<this.dayZeroHourly.length;i++){
        output = output + '\n' + this.dayZeroHourly[i].precipitation + '% at ' + i;
      }
      return output;
    } else if(input.includes('hourly temp')) {
      let output: string = '';
      output = output + this.dayZeroHourly[0].temperature_2m + 'F at ' + 0;
      for(let i=1;i<this.dayZeroHourly.length;i++){
        output = output + '\n' + this.dayZeroHourly[i].temperature_2m + 'F at ' + i;
      }
      return output;
    } else if(input.includes('hourly forecast') || input === 'hourly'){
      let output: string = '';
      output = output + this.dayZeroHourly[0].temperature_2m + 'F and ' + this.getCondition(this.dayZeroHourly[0].weathercode, true) + ' at ' + 0;
      for(let i=1;i<this.dayZeroHourly.length;i++){
        output = output + '\n' + this.dayZeroHourly[i].temperature_2m + 'F and ' + this.getCondition(this.dayZeroHourly[i].weathercode, true) + ' at ' + i;
      }
      return output;
    } else if(!input.includes('hourly')){
      if(input.includes('temp')){
        return 'The temperature at ' + hourStr + ' will be ' + this.dayZeroHourly[hour].temperature_2m + 'F with a feels like of ' + this.dayZeroHourly[hour].apparent_temperature + 'F at ' + hourStr + '. ';
      } else if(input.includes('precip')){
        return 'There is a ' + this.dayZeroHourly[hour].precipitation + '% chance of showers at ' + hourStr + '. '
      } else {
        return 'It will be ' + this.dayZeroHourly[hour].temperature_2m + 'F and ' + this.getCondition(this.dayZeroHourly[hour].weathercode, true) + ' with a ' + this.dayZeroHourly[hour].precipitation + '% chance of precipitation at ' + hourStr;
      }
    }


    return input + ' has not been implemented yet. Type \"help\" for the list of currently supported commands. ';
  }

  singleDayForecast(input: string) {
    return 'Daily forecast coming soon. '
  }

}
