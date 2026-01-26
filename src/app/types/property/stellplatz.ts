export type Stellplatz = {
  id: string;
  kennzeichen: string;
  besonderheit: string | null;
  standort: string;
  availability: boolean;
  bild: string | null;
  flugzeugtyp: string | null;
  flugzeuggroesse: string | null;
  services: {
    bezeichnung: string;
    preis: number;
    einheit: string;
  }[];
};


