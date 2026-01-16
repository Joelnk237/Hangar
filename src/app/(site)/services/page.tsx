import React from 'react';
import { Metadata } from "next";
import Services from '@/app/components/services/Services';

export const metadata: Metadata = {
  title: "Services",
};

const Page = () => {
    const allServicesFromDB = {
  services: {
    einlagerung: {
      price: 15,
      unit: "pro Tag",
    },
    flugbereitschaft: {
      price: 50,
      unit: "pauschal",
    },
    tanken: {
      price: 2.8,
      unit: "pro Liter",
    },
    reinigung: {
      price: 40,
      unit: "komplett",
    },
  },
  zusatzservices: [
    {
      id: "zs-1",
      bezeichnung: "Enteisung",
      beschreibung: "Enteisung des Flugzeugs im Winterbetrieb",
      price: 120,
      unit: "pro Vorgang",
    },
    {
      id: "zs-2",
      bezeichnung: "Innenreinigung",
      beschreibung: "Reinigung des Cockpits und Innenraums",
      price: 60,
      unit: "pauschal",
    },
  ],
};

  return (
    <>
      <Services allServices={allServicesFromDB} />
    </>
  );
};

export default Page;