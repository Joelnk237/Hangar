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





export type ServiceDefinition = {
  serviceId: number;
  bezeichnung: string;
  einheiten: string[];
};

export const SERVICE_DEFINITIONS: ServiceDefinition[] = [
  {
    serviceId: 1,
    bezeichnung: "Einlagerung",
    einheiten: ["pro Tag", "pro Woche", "pro Monat"],
  },
  {
    serviceId: 2,
    bezeichnung: "Flugbereitschaft",
    einheiten: ["pro Vorgang", "pauschal"],
  },
  {
    serviceId: 3,
    bezeichnung: "Tanken",
    einheiten: ["pro Liter", "pauschal"],
  },
  {
    serviceId: 4,
    bezeichnung: "Reinigung",
    einheiten: ["innen", "außen", "komplett"],
  },
];

