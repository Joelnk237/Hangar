import React from 'react';
import { Metadata } from "next";
import StellplaetzeDashboard from '@/app/components/home/Stellplaetze/stellplaetzeDashboard';

export const metadata: Metadata = {
  title: "Stellplaetze verwalten",
};

const Page = () => {


  return (
    <>
      <StellplaetzeDashboard />
    </>
  );
};

export default Page;