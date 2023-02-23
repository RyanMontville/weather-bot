export class Location {
    constructor(
        public summary: {numResults: number},
        public results: Result[]
    ) {}
}

export class Result {
    constructor(
        public address: {freeformAddress: string,},
        public position: {lat: number,lon: number}
    ) {}
}