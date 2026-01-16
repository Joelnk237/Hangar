import React from 'react';
import { Metadata } from "next";
import FlugzeugForm from '@/app/components/flugzeuge/FlugzeugForm';

export const metadata: Metadata = {
  title: "Create Flugzeug",
};

const Page = () => {
  return (
    <>
      <FlugzeugForm
  mode="create"
    />
    </>
  );
};

export default Page;