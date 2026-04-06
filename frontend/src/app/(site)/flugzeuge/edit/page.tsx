import React from 'react';
import { Metadata } from "next";
import FlugzeugForm from '@/app/components/flugzeuge/FlugzeugForm';

export const metadata: Metadata = {
  title: "Edit Flugzeug",
};

const Page = () => {
    const flugzeugFromDB = {
  kennzeichen: "AQKDJTEJSKD",
  baujahr: 2025,
  bild: null,

  flugzeugtyp: "Jet",
  flugzeuggroesse: "M",

  flugstunden: 300000,
  flugkilometer: 15000,
  treibstoffverbrauch: 6500,
  frachtkapazitaet: 500,
};

  return (
    <>
      <FlugzeugForm
  mode="edit"
  initialData={flugzeugFromDB}
    />
    </>
  );
};

export default Page;