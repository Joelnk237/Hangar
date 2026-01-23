"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Termin } from '@/app/types/property/termin';
import Image from 'next/image';


import { Hr } from "@react-email/components";

type Props = {
  termine: Termin[];
};
const Termine = ({ termine }: Props) => {
    


    if (termine.length === 0) {
        return (
                  <div className="pt-24 pb-32 h-[95vh] bg-light dark:bg-darkmode">
            <div className="pt-11 flex justify-center items-center text-center ">
       
                <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
                    <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
        <div className="flex flex-col gap-5 items-center justify-center pt-20">
            <Image
            src="/images/not-found/no-results.png"
            alt="no-result"
            width={100}
            height={100}
            />
            <p className="text-gray">Kein Termin vorhanden</p>
        </div></div></div></div></div>
        );
  }
    

    return(

    <>
        {/* ================= MODAL ================= */}
        <div className="pt-24 pb-32 h-[95vh] bg-light dark:bg-darkmode">
            <div className="pt-11 flex justify-center items-center text-center ">
       
                <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
                    <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
        <div>
            <>
                <div className="grid grid-cols-8 gap-2 font-semibold border-b pb-2">
                    <div>Kategorie</div>
                    <div>Termin_Zeitpunkt</div>
                    <div>Stellplatz</div>
                    <div>Standort</div>
                    <div>Kundenname</div>
                    <div>Kunden-Email</div>
                    <div>Flugzeug</div>
                    <div></div> 
                    </div>
                <Hr className="my-[16px] border-gray-300" />
                {/* ================= ROWS ================= */}
                {termine.map((r) => (
                    <div
                        key={r.id}
                        className="grid grid-cols-8 gap-2 border-b py-2"
                    >
                    <div>{r.is_uebergabe?"Übergabetermin":"Rückgabetermin"}</div>
                    <div>{r.termin_zeitpunkt}</div>
                    <div>{r.stellplatz.kennzeichen}</div>
                    <div>{r.stellplatz.standort}</div>
                    <div>{r.flugzeugbesitzer.name}</div>
                    <div>{r.flugzeugbesitzer.email}</div>
                    <div>{r.flugzeug.kennzeichen}</div>
                    <div>
                    </div>

                    <Hr className="my-[12px] border-gray-200" />
                </div>
                ))}
            </>  
        </div>
        </div>
            </div>
            </div>
            </div>
    
    
    </>
    );
};

export default Termine;