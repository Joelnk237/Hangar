export type StellplatzInfos = {
  id:String,
  services: Record<
    string,
    { enabled: boolean; price: number; unit: string }
  >;
  bild:string;
  availability: boolean;
  flugzeugtyp: string;
  flugzeugsgrösse: string;
  kennzeichen?: string;
  standort?: string;
  besonderheit?: string;
};