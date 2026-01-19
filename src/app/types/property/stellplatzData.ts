export type stellplatzData = {
        id: string,
        hangaranbieter: string,
        verfügbarkeit: string,
        bild: string,
        flugzeugtyp: string,
        flugzeuggroesse: string,
        services:string[],
        ort: string,
    };

export type stellplatzDataSearch = {
        id: string,
        hangaranbieter: string,
        verfügbarkeit: string,
        besonderheit:string,
        einstellbedingung:string,
        flugzeugtyp: string,
        flugzeuggroesse: string,
        services:string[],
        ort: string,
    };


export type Merkmale = {
  [key: string]: {
    enabled: boolean;
    [subKey: string]: boolean;
  };
};

export type Services = {
  [key: string]: {
    price: number;
    unit: string;
  };
};

export type StellplatzInfosProps = {
 // stellplatz: {
    id: string,
    anbieterName: string;
    ort: string;
    availability: string;
    bild: string | null;

    flugzeugtyp: string;
    flugzeuggroesse: string;

    merkmale: Merkmale;
    services: Services;
    besonderheiten: string;
 // };
};
