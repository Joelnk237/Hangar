export type allServicesTyp = {
  services: 
    {
    serviceId: number;
    bezeichnung: string;
    preis: number;
    einheit: string;
    }[]
  zusatzservices:
    {
      id: number;
      bezeichnung: string;
      beschreibung: string;
      preis: number;
      einheit: string,
    }[]
}





export type Typ = {
  services: [
    {
    id: 1;
    bezeichnung: "einlagerung",
    preis: 15,
    einheit: "pro Tag",
    },
    {
    id: 2;
    bezeichnung: "flugbereitschaft"
    preis: 50,
    einheit: "pauschal",
    },
    {
    id: 3;
    bezeichnung: "tanken"
    preis: 2.8,
    einheit: "pro Liter",
    }
],
  zusatzservices: [
    {
      id: 1,
      bezeichnung: "Enteisung",
      beschreibung: "Enteisung des Flugzeugs im Winterbetrieb",
      preis: 120,
      einheit: "pro Vorgang",
    },
    {
      id: 2,
      bezeichnung: "Innenreinigung",
      beschreibung: "Reinigung des Cockpits und Innenraums",
      preis: 60,
      einheit: "pauschal",
    },
  ]
}