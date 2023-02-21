export class Weather {
    public latitude: number;
    public longitude: number;
    public elevation: number;
    public hourly: {
        time: string[],
        temperature_2m: number[],
        relativehumidity_2m: number[],
        apparent_temperature: number[],
        precipitation: number[],
        weathercode: number[]
    }
    public daily: {
        time: string[],
        weathercode: number[],
        temperature_2m_max: number[],
        temperature_2m_min: number[],
        sunrise: string[],
        sunset: string[],
        uv_index_max: number[],
        precipitation_sum: number[]
    }

    constructor() {
        this.latitude = 0;
        this.longitude = 0;
        this.elevation = 0;
        this.hourly = {
            time: [],
            temperature_2m: [],
            relativehumidity_2m: [],
            apparent_temperature: [],
            precipitation: [],
            weathercode: []
        };
        this.daily = {
            time: [],
            weathercode: [],
            temperature_2m_max: [],
            temperature_2m_min: [],
            sunrise: [],
            sunset: [],
            uv_index_max: [],
            precipitation_sum: []
        }
    }

    setLatitude(latitude: number) { this.latitude = latitude; }
    setLongitude(longitude: number) { this.longitude = longitude; }
    setElevation(elevation: number) { this.elevation = elevation; }
    setDaily(daily: {
        time: string[],
        weathercode: number[],
        temperature_2m_max: number[],
        temperature_2m_min: number[],
        sunrise: string[],
        sunset: string[],
        uv_index_max: number[],
        precipitation_sum: number[]
    }) {
        this.daily = daily;
    }
}

export class Hourly {
    constructor(
        public time: number,
        public temperature_2m: number,
        public relativehumidity_2m: number,
        public apparent_temperature: number,
        public precipitation: number,
        public weathercode: number) {}
}

export class Daily {
    constructor(
        public time: string,
        public weathercode: number,
        public temperature_2m_max: number,
        public temperature_2m_min: number,
        public sunrise: string,
        public sunset: string,
        public uv_index_max: number,
        public precipitation_sum: number
    ) {}

}