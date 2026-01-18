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
};