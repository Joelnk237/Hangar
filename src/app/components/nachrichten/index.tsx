"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Nachricht } from '@/app/types/property/nachricht';
import Image from 'next/image';
import { Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';


import { Hr } from "@react-email/components";

type Props = {
  nachrichten: Nachricht[];
};
const Nachrichten = ({ nachrichten }: Props) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
  const [selectedNachricht, setSelectedNachricht] = useState<Nachricht | null>(null);

  const openModal = (n: Nachricht) => {
    setSelectedNachricht(n);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNachricht(null);
  };
    
const formatTermin = (isoString: string) => {
  const date = new Date(isoString);

  return date.toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const deleteNachricht = async (id: number) => {

    try {
        const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8888/api/nachrichten/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Löschen fehlgeschlagen");
        throw new Error("Delete failed");
      }
      toast.success("Die Nachricht wurde erfolgreich gelöscht !");
      // reload
    window.location.reload();

    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Löschen");
    }
  };

    if (nachrichten.length === 0) {
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
            <p className="text-gray">Keine Nachricht vorhanden</p>
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
                <div className="grid grid-cols-4 gap-2 font-semibold border-b pb-2">
                    <div>Absender</div>
                    <div>Kategorie</div>
                    <div>Datum</div>
                    <div>Aktion</div> 
                    </div>
                <Hr className="my-[16px] border-gray-300" />
                {/* ================= ROWS ================= */}
                {nachrichten.map((n) => (
                    <div
                        key={n.id}
                        className="grid grid-cols-4 gap-2 border-b py-2"
                    >
                    <div>{n.hangaranbieter.firmenname}</div>
                    <div>{n.is_detailsinfos?"Detailsinfo":"Ankündigung"}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{formatTermin(n.date)}</div>
                    <div>
                        <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                            onClick={() => openModal(n)}
                                title="ansehen">
                                <Eye size={18}/>
                        </button>
                        <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                        onClick={() => deleteNachricht(n.id)}
                        title="löschen"
                        >
                            <Trash2 size={18} />
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

        {/* ================= MODAL ================= */}
      {showModal && selectedNachricht && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}   // clic overlay = fermer
        >
          <div
            className="bg-white dark:bg-semidark rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()} // empêcher fermeture sur clic interne
          >
            <h2 className="text-lg font-semibold">
              Nachricht
            </h2>

            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {selectedNachricht.inhalt || "—"}
            </div>

            {/* Link zum Stellplatz si Detailsinfo */}
            {selectedNachricht.is_detailsinfos && selectedNachricht.stellplatz && (
              <div className="pt-2">
                <button
                  onClick={() => router.push(`/stellplaetze/${selectedNachricht.stellplatz?.id}`)}
                  className="text-primary underline hover:text-primary/80"
                >
                  Link zum Stellplatz
                </button>
              </div>
            )}

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

export default Nachrichten;