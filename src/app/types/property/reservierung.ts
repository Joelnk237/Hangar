export type Reservierung = {
    stellplatz:{
        id: string;
        kennzeichen: string;
        standort: string;
    },
    flugzeug:{
        id: string;
        kennzeichen: string;
    },
    flugzeugbesitzer:{
        id: string;
        name: string;
        email: string;
    },
    zeitraum:{
        von:string;
        bis: string;
    }
};