import React from 'react';
import { Metadata } from "next";
import FlugzeugeDashboard from '@/app/components/home/Stellplaetze/FlugzeugeDashboard';

export const metadata: Metadata = {
  title: "Flugzeuge verwalten",
};

const Page = ({ searchParams }: any) => {
  const category = searchParams?.category || ''; 

  return (
    <>
      <FlugzeugeDashboard category={category} />
    </>
  );
};

export default Page;