import React from 'react';
import { Metadata } from "next";
import NewStellplatz from '@/app/components/home/Stellplaetze/NewStellplatz';

export const metadata: Metadata = {
  title: "Edit Stellplatz",
};

const Page = () => {
    const stellplatzInfos = {
        kennzeichen: "NKJG2",
        standort: "Frankfurt",
        besonderheit: " Gut für Sie",
    services: {
        einlagerung: {
    enabled: true,
    price: 30,
    unit: "pro Tag",
        },
        flugbereitschaft: {
            enabled: false,
            price: 45,
            unit: "pro Vorgang",
        },
        tanken: {
            enabled: true,
            price: 3,
            unit: "pro Liter",
        },
        reinigung: {
            enabled: false,
            price: 5,
            unit: "komplett",
        }
    },
    flugzeugtyp: 'Helikopter',
    flugzeugsgrösse:'M'
    
}
  return (
    <>
      <NewStellplatz mode="edit"
        stellplatzInfos={stellplatzInfos}/>
    </>
  );
};

export default Page;