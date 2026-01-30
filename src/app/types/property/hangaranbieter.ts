export type HangaranbieterTyp = {
    general:HangaranbieterInfosTyp;
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

export type HangarMerkmale = {
  wetterschutz: {
    enabled: boolean;
    voll: boolean;
    teil: boolean;
  };
  flugfeld: {
    enabled: boolean;
    asphalt: boolean;
    gras: boolean;
  };
  zugang24h: {
    enabled: boolean;
    code: boolean;
    chip: boolean;
  };
  wachschutz: {
    enabled: boolean;
    alarm: boolean;
    zutritt: boolean;
  };
  video: {
    enabled: boolean;
    live: boolean;
    recording24h: boolean;
  };
};

export type HangaranbieterInfosTyp = {
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
    hangar_merkmale:HangarMerkmale;
};