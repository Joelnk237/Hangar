"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Anfrage } from '@/app/types/property/anfrage';
import Image from 'next/image';
import { Trash2, Edit2, Check, Eye } from 'lucide-react';
import toast from 'react-hot-toast';


import { Hr } from "@react-email/components";

type Props = {
  anfragen: Anfrage[];
};
const Anfragen = ({ anfragen }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAnfrage, setSelectedAnfrage] = useState<Anfrage | null>(null);

    const openModal = (anfrage: Anfrage) => {
    setSelectedAnfrage(anfrage);
    setShowModal(true);
    };

    const closeModal = () => {
    setShowModal(false);
    setSelectedAnfrage(null);
    };

    const handleDeleteAnfrage = async (id: number) => {
  /*const confirmed = window.confirm(
    "Möchten Sie diese Anfrage wirklich löschen?"
  );

  if (!confirmed) return;*/

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8888/api/anfragen/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok && res.status !== 204) {
      const text = await res.text();
      throw new Error(text || "Löschen fehlgeschlagen");
    }


    setSelectedAnfrage(null);
    setShowModal(false);
    toast.success("Die Anfrage wurde erfolgreich gelöscht !");


    // reload
    window.location.reload();

  } catch (err) {
    console.error(err);
    toast.error("Fehler beim Löschen der Anfrage");
  }
};



    

    if (anfragen.length === 0) {
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
            <p className="text-gray">Keine Anfrage vorhanden</p>
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
                    <div>Stellplatz</div>
                    <div>Standort</div>
                    <div>Kundenname</div>
                    <div>Email</div>
                    <div>Status</div>
                    <div>Aktion</div>
                    <div></div>
                    </div>
                <Hr className="my-[16px] border-gray-300" />
                {/* ================= ROWS ================= */}
                {anfragen.map((a) => (
                    <div
                        key={a.id}
                        className="grid grid-cols-8 gap-2 border-b py-2"
                    >
                    <div>{a.is_detailsinfos? "Detailsinfos" : "Kundenanfrage"}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{a.stellplatz.kennzeichen}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{a.stellplatz.standort}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{a.flugzeugbesitzer.name}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{a.flugzeugbesitzer.email}</div>
                    <div>{a.answered?"OK":"-"}</div>
                    <div className="grid grid-cols-3 gap-2">
                        {!a.answered && ( a.is_detailsinfos ? 
                            (<button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                                title="Detailsinfo erfassen"
                            >
                                <Edit2 size={18} />{a.stellplatz.id}
                            </button>)
                            :
                            (<><button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                                onClick={() => openModal(a)}
                                title="ansehen">
                                <Eye size={18}/>
                            </button>
                            <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                                title="als erledigt markieren"
                            ><Check size={18}/></button></>))}
                        <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                        onClick={() => handleDeleteAnfrage(a.id)}
                        title="stornieren"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div></div>
                    <Hr className="my-[12px] border-gray-200" />
                </div>
                ))}
            </>  
        </div>
        </div>
            </div>
            </div>
            </div>
        
        {showModal && selectedAnfrage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-semidark rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">

      <h2 className="text-lg font-semibold text-midnight_text">
        Anfrage Details
      </h2>

      <div>
        <p className="font-semibold">Betreff</p>
        <p className="text-gray-700 dark:text-gray-300">
          {selectedAnfrage.betreff || "—"}
        </p>
      </div>

      <div>
        <p className="font-semibold">Inhalt</p>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {selectedAnfrage.inhalt || "—"}
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Schließen
        </button>
      </div>

    </div>
  </div>
)}

    
    
    </>
    );
};

export default Anfragen;