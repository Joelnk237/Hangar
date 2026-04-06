import React from 'react';
import { Metadata } from "next";
import NewStellplatz from '@/app/components/home/Stellplaetze/NewStellplatz';

export const metadata: Metadata = {
  title: "Neuer Stellplatz",
};

const Page = () => {
  return (
    <>
      <NewStellplatz mode="create"/>
    </>
  );
};

export default Page;