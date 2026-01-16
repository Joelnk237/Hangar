export type Stellplatz = {
    id: string,
    status: string,
    image: string,
    flugzeugtyp: string,
    abmessung:{
        spannweite: number,
        laenge: number,
        hoehe: number
    }
    wetterschutz: boolean,

  flugfeld: boolean,

  zugang24h: boolean,

  wachschutz: false,
  einlagerung:{
    preis: number,
    einheit: string
  },
  ort: string
};