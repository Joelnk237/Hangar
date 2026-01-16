import React from 'react';
import { Metadata } from "next";
import FlugzeugInfo from '@/app/components/flugzeuge/FlugzeugInfo';

export const metadata: Metadata = {
  title: "Explore FlugzeugInfo",
};

const Page = () => {
    const flugzeugInfos = {
        flugzeug: {
    kennzeichen: "D-ABCD",
    baujahr: 2018,
    flugzeugtyp: "Helikopter",
    flugzeuggroesse: "M",
    flugstunden: 1200,
    flugkilometer: 85000,
    treibstoffverbrauch: 45,
    frachtkapazitaet: 350,
  },
  hangar:{
    stellplatzKennzeichen: "H-23",
    hangaranbieter: "Hangar München GmbH",
    ort: "München",
    services: ["Tanken", "Reinigung"],
    uebergabetermin: "2026-03-01",
    rueckgabetermin: "2026-03-15",
  },
  wartung:{
    fahrbereitschaft: "Ja",
    wartungszustand: "Sehr gut",
  }
    }

  return (
    <>
      <FlugzeugInfo
  flugzeug={flugzeugInfos.flugzeug}
  hangar={flugzeugInfos.hangar}
  wartung={flugzeugInfos.wartung}
    />
    </>
  );
};

export default Page;