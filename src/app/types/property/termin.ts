export type Termin = {
    id:string;
    is_uebergabe:boolean;
    termin_zeitpunkt: string;
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
    hangaranbieter:{
        id:string;
        firmenname:string;
    }
};