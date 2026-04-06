"use client";

import React, { useEffect, useState } from 'react';
import { HangaranbieterInfosTyp, HangaranbieterSpezialisierungen } from '@/app/types/property/hangaranbieter';
import HangaranbieterEditForm from './HangaranbieterEditForm';
import { Edit } from 'lucide-react';


type Props = {
  data: HangaranbieterInfosTyp;
  spezialisierungen: HangaranbieterSpezialisierungen;
};
const FlugzeugbesitzerProfil = ({ data, spezialisierungen }: Props) => {

    const [editMode, setEditMode] = useState(false);
    const merkmale = data.hangar_merkmale;

    const renderMerkmalBlock = (
    title: string,
    merkmal: { enabled: boolean; [key: string]: boolean }
  ) => {
    if (!merkmal.enabled) return null;

    return (
      <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800">
        <h6 className="font-semibold mb-2">{title}</h6>
        <ul className="pl-5 text-sm space-y-1">
          {Object.entries(merkmal)
            .filter(([key, value]) => key !== "enabled" && value)
            .map(([key]) => (
              <li key={key}>{key}</li>
            ))}
        </ul>
      </div>
    );
  };

  if (editMode) {
    return (
      <HangaranbieterEditForm
        initialData={data}
        initialSpezialisierungen={spezialisierungen}
        onCancel={() => setEditMode(false)}
        onSaved={(updatedData) => {
          console.log("UPDATED:", updatedData);
          setEditMode(false);
          window.location.reload();
        }}
      />
    );
  }
    
    return(

    <>
        <div className="pt-24 pb-32 bg-light dark:bg-darkmode">
            <div className="pt-11 flex justify-center items-center text-center ">
       
                <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
                    <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
        <div className="bg-white dark:bg-semidark p-6 rounded-lg shadow">

      <h2 className="text-2xl font-bold mb-4">
        General
      </h2>

      <div className="grid grid-cols-2 gap-4 text-lg">
        <div><b>Firmenname:</b> {data.firmenname}</div>
        <div><b>Ansprechpartner:</b> {data.ansprechpartner!=null?data.ansprechpartner:""}</div>
        <div><b>Email:</b> {data.email}</div>
        <div><b>Telefon:</b> {data.tel}</div>


          <b>Adresse:</b> {data.strasse} {data.hausnummer}, {data.plz} {data.ort}
        
      </div>
      
    </div>
    <div className="pt-18 bg-white dark:bg-semidark p-6 rounded-lg shadow">

    <h2 className="text-2xl font-bold mb-4">
        Spezialisierungen
    </h2>

    <div className="grid grid-cols-2 gap-4 text-lg">
        <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
            <b className="block mb-2">Flugzeugtypen:</b>
            <ul className="ml-5 space-y-1 text-sm">
            {spezialisierungen?.flugzeugtypen?.map((t) => (
                <li key={t}>{t}</li>
            ))}
            </ul>
        </div>

        <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
            <b className="block mb-2">Flugzeuggrößen:</b>
            <ul className="ml-5 space-y-1 text-sm">
            {spezialisierungen?.flugzeuggroessen?.map((g) => (
                <li key={g}>{g}</li>
            ))}
            </ul>
        </div>
        
    </div>
        
    </div>
        <div className="pt-18 bg-white dark:bg-semidark p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
            Hangar-Merkmale
        </h2>

        <div className="grid grid-cols-2 gap-4 text-lg">

                  {renderMerkmalBlock("Wetterschutz", merkmale.wetterschutz)}
                  {renderMerkmalBlock("Flugfeld", merkmale.flugfeld)}
                  {renderMerkmalBlock("24h Zugang", merkmale.zugang24h)}
                  {renderMerkmalBlock("Wachschutz", merkmale.wachschutz)}
                  {renderMerkmalBlock("Videoüberwachung", merkmale.video)}

                </div>
        
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            onClick={() => setEditMode(true)}
            title="bearbeiten"
          >
            <Edit size={26}/>
          </button>
        </div>
    </div></div></div></div>
    
    
    </>
    );
};

export default FlugzeugbesitzerProfil;