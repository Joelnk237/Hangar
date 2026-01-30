export type Nachricht = {
    id:number;
    is_detailsinfos:boolean;
    date:string;
    inhalt: string | null;
    stellplatz:{
        id: string;
        kennzeichen: string;
        standort: string;
    } | null,
    hangaranbieter:{
        id:string;
        firmenname:string;
    }
    flugzeugbesitzer:{
        id: string;
        name: string;
        email: string;
    }
};