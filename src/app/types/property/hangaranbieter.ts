export type HangaranbieterTyp = {
    general:{
        id: string;
        benutzer_id:string;
        firmenname: string;
        email: string;
        tel: string;
        strasse:string;
        hausnummer:string;
        plz:string;
        ort:string;
        ansprechpartner:string | null;
        hangar_merkmale:Record<string, {
      enabled: boolean;
      price: string;
      unit: string;
    }>;
    },
    stellplaetze:{
        total:number;
        frei: number;
        belegt: number;
    },
    reservierungen:{
        anzahl: number;
    },
    termine:{
        anzahl:number;
    }
    anfragen:{
        anzahl:number;
    }
};