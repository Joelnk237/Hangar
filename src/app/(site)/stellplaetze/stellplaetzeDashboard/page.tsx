import React from 'react';
import { Metadata } from "next";
import StellplaetzeDashboard from '@/app/components/home/Stellplaetze/stellplaetzeDashboard';

export const metadata: Metadata = {
  title: "Stellplaetze verwalten",
};

const Page = ({ searchParams }: any) => {
  const category = searchParams?.category || ''; 

  return (
    <>
      <StellplaetzeDashboard category={category} />
    </>
  );
};

export default Page;