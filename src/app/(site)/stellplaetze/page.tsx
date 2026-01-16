import React from 'react';
import { Metadata } from "next";
import StellplatzInfos from '@/app/components/home/Stellplaetze/StellplatzInfos';

export const metadata: Metadata = {
  title: "Edit Flugzeug",
};

const Page = () => {
    const stellplatzInfosFromDB = {
        anbieterName: "Hangar FFM GmbH",
  ort: "EM - Frankfurt",
  availability: "2025-03-06",
  bild: "/images/properties/stellplatz1.jpg",

  flugzeugtyp: "Helikopter",
  flugzeuggroesse: "M",
  merkmale:{
    wetterschutz: {
    enabled: true,
    voll: false,
    teil: true,
  },
  flugfeld: {
    enabled: true,
    asphalt: false,
    gras: true,
  },
  zugang24h: {
    enabled: true,
    code: true,
    chip: false,
  },
  wachschutz: {
    enabled: false,
    alarm: false,
    zutritt: false,
  },
  },
  services:{
    einlagerung: { price: 30, unit: "pro Tag" },
    flugbereitschaft: { price: 45, unit: "pro Vorgang" },
    tanken: { price: 3, unit: "pro Liter" },
    reinigung: { price: 5, unit: "komplett" },
  },
  besonderheiten: "",
};

  return (
    <>
      <StellplatzInfos
  stellplatz={stellplatzInfosFromDB}
    />
    </>
  );
};

export default Page;