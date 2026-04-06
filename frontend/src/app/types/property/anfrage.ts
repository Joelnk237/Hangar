export type Anfrage = {
    id:number;
    is_detailsinfos:boolean;
    answered:boolean;
    betreff: string | null;
    inhalt: string | null;
    stellplatz:{
        id: string;
        kennzeichen: string;
        standort: string;
    },
    hangaranbieter:{
        id:string;
        firmenname:string;
    }
    flugzeugbesitzer:{
        id: string;
        name: string;
        email: string;
    },
    flugzeug:{
        id: string;
        kennzeichen: string;
    },
};