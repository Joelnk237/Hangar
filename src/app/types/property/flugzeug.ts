export type Flugzeug = {
  id: string;
  kennzeichen: string;
  bild: string | null;
  flugzeugtyp: string | null;
  flugzeuggroesse: string | null;
  flugstunden: number | null;
  flugkilometer: number | null;
  treibstoffverbrauch: number | null;
  frachtkapazitaet: number | null;
  status: boolean;
};
export type FlugzeugFormData = {
  kennzeichen: string;
  baujahr: number | "";
  bild: File | null;

  flugzeugtyp: string;
  flugzeuggroesse: string;

  flugstunden: number | "";
  flugkilometer: number | "";
  treibstoffverbrauch: number | "";
  frachtkapazitaet: number | "";
  /*abmasse:{
    fluegelspannweite: number | "";
    laenge: number | "";
    hoehe: number | "";
  }*/
};

export type FlugzeugInfoProps = {
  flugzeug: {
    id:string;
    kennzeichen: string;
    status:boolean;
    baujahr: number;
    flugzeugtyp: string;
    flugzeuggroesse: string;
    flugstunden: number;
    flugkilometer: number;
    treibstoffverbrauch: number;
    frachtkapazitaet: number;
    abmasse: {
      fluegelspannweite: number;
      laenge:number;
      hoehe:number
    };
  };

  hangar: {
    stellplatz_id: string;
    stellplatzKennzeichen: string;
    hangaranbieterId: string;
    hangaranbieter: string;
    ort: string;
    services: {
      bezeichnung:string;
      preis: number;
      einheit: string;
    }[];
    von: string;
    bis: string;
    uebergabetermin: string;
    rueckgabetermin: string;
  };

  zustand: {
    fahrbereitschaft: string;
    beschreibung:  string;
    wartungszustand: string;
  };
};