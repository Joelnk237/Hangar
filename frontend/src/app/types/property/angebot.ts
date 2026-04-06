export type Angebot = {
    id: number,
    accepted:boolean | null,
    inhalt: string | null,
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