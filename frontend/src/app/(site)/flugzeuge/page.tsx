import React from 'react';
import { Metadata } from "next";
import FlugzeugDashboard from '@/app/components/flugzeuge/FlugzeugDashboard';

export const metadata: Metadata = {
  title: "Meine Flugzeuge",
};

const Page = ({ searchParams }: any) => {
  const category = searchParams?.category || ''; 

  return (
    <>
      <FlugzeugDashboard category={category} />
    </>
  );
};

export default Page;