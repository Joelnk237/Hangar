"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { FlugzeugbesitzerTyp } from '@/app/types/property/flugzeugbesitzer';


type Props = {
  data: FlugzeugbesitzerTyp;
};
const FlugzeugbesitzerProfil = ({ data }: Props) => {
    
    return(

    <>
    <div className="pt-24 pb-32 h-[95vh] bg-light dark:bg-darkmode">
            <div className="pt-11 flex justify-center items-center text-center ">
       
                <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
                    <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
        <div className="bg-white dark:bg-semidark p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Profil Flugzeugbesitzer
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><b>Name:</b> {data.name}</div>
        <div><b>Email:</b> {data.email}</div>
        <div><b>Telefon:</b> {data.tel}</div>

        <div className="col-span-2">
          <b>Adresse:</b> {data.strasse} {data.hausnummer}, {data.plz} {data.ort}
        </div>
      </div>
    </div></div></div></div></div>
    
    
    </>
    );
};

export default FlugzeugbesitzerProfil;