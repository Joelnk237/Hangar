"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Angebot } from '@/app/types/property/angebot';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';


import { Hr } from "@react-email/components";

type Props = {
  angebote: Angebot[];
};
const Angebote = ({ angebote }: Props) => {
    const router = useRouter();


  const [selected, setSelected] = useState<number | null>(null);



  const acceptAngebot = async (id: number) => {

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8888/api/angebote/${id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      toast.success("Sie haben das Angebot angenommen !")
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Fehler ");
    }
  };
    const declineAngebot = async (id: number) => {

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8888/api/angebote/${id}/deny`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      toast.success("Sie haben das Angebot abgelehnt !")
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Fehler ");
    }
  };




    if (angebote.length === 0) {
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
            <p className="text-gray">Keine Angebote vorhanden</p>
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
                    <div>Stellplatz</div>
                    <div>Standort</div>
                    <div>Von</div>
                    <div>Bis</div>
                    <div> Inhalt</div>
                    <div> Aktion </div>
                    <div>Aktion</div>
                    <div>Status</div>
                    </div>
                <Hr className="my-[16px] border-gray-300" />
                {/* ================= ROWS ================= */}
                {angebote.map((r) => (
                    <div
                        key={r.id}
                        className="grid grid-cols-8 gap-2 border-b py-2"
                    >
                    <div>{r.stellplatz.kennzeichen}</div>
                    <div>{r.stellplatz.standort}</div>
                    <div>{r.zeitraum.von}</div>
                    <div>{r.zeitraum.bis}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{r.inhalt}</div>
                    <div>{r.accepted!=null ? "" : (<button
                                                onClick={() => acceptAngebot(r.id)} 
                                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                                                title="annehmen"
                                            >
                                                Annehmen
                                            </button>)}</div>
                    <div>{r.accepted!=null ? "" : (<button
                                                onClick={() => declineAngebot(r.id)} 
                                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                                                title="ablehnen"
                                            >
                                                Ablehnen
                                            </button>)}</div>
                    <div>{r.accepted==null?"noch nicht angegeben": (r.accepted ? "angenommen":"abgelehnt")}</div>

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

export default Angebote;