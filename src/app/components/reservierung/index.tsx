"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Reservierung } from '@/app/types/property/reservierung';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

import { Hr } from "@react-email/components";

type Props = {
  reservierungen: Reservierung[];
};
const Reservierungen = ({ reservierungen }: Props) => {
    var i=0;



    if (reservierungen.length === 0) {
        return (
        <div className="flex flex-col gap-5 items-center justify-center pt-20">
            <Image
            src="/images/not-found/no-results.png"
            alt="no-result"
            width={100}
            height={100}
            />
            <p className="text-gray">Keine Reservierung vorhanden</p>
        </div>
        );
  }
    

    return(
    <>
        <div className="pt-24 pb-32 h-[95vh] bg-light dark:bg-darkmode">
            <div className="pt-11 flex justify-center items-center text-center ">
       
                <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
                    <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
        <div>
            <>
                <div className="grid grid-cols-8 gap-2 font-semibold border-b pb-2">
                    <div>Stellplatz</div>
                    <div>Standort</div>
                    <div>Flugzeug</div>
                    <div>Von</div>
                    <div>Bis</div>
                    <div>Kundenname</div>
                    <div>Kunden-Email</div>
                    <div>Aktion</div>
                    </div>
                <Hr className="my-[16px] border-gray-300" />
                {/* ================= ROWS ================= */}
                {reservierungen.map((r) => (
                    <div
                        key={i++}
                        className="grid grid-cols-8 gap-2 border-b py-2"
                    >
                    <div>{r.stellplatz.kennzeichen}</div>
                    <div>{r.stellplatz.standort}</div>
                    <div>{r.flugzeug.kennzeichen}</div>
                    <div>{r.zeitraum.von}</div>
                    <div>{r.zeitraum.bis}</div>
                    <div>{r.flugzeugbesitzer.name}</div>
                    <div>{r.flugzeugbesitzer.email}</div>
                    <div>
                    <button 
                        
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                        title="stornieren"
                    >
                        <Trash2 size={22} />
                    </button>
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

export default Reservierungen;