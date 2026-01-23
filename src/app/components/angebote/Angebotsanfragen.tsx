"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Angebot } from '@/app/types/property/angebot';
import Image from 'next/image';
import { Trash2, Edit } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { Hr } from "@react-email/components";

type Props = {
  angebote: Angebot[];
};
const Angebote = ({ angebote }: Props) => {
    var i=0;
    const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [angebotText, setAngebotText] = useState("");


  const deleteAngebot = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8888/api/angebote/${selected}`,
        {
          method: "DELETE",
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

      setShowModal(false);
      setSelected(null);
      toast.success("Angebot erfolgreich storniert");
      // 
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Stornieren der Reservierung");
    }
  };

  const createAngebot = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");

    try {
    const res = await fetch(
      `http://localhost:8888/api/angebote/${selected}/propose`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          inhalt: angebotText,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    setShowCreateModal(false);
    setSelected(null);
    setAngebotText("");
    toast.success("Angebot erfolgreich erfasst");

    router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Erstellen eines Angebotes");
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
            <p className="text-gray">Keine Angebotsanfrage vorhanden</p>
        </div></div></div></div></div>
        );
  }
    

    return(

    <>
        {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-semidark rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Angebot stornieren
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Sind Sie sicher, dass Sie dieses Angebot stornieren möchten?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Abbrechen
              </button>
              <button
                onClick={deleteAngebot}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="bg-white dark:bg-semidark rounded-xl p-6 w-full max-w-lg">
      <h2 className="text-lg font-semibold mb-4">
        Angebot formulieren
      </h2>

      <textarea
        value={angebotText}
        onChange={(e) => setAngebotText(e.target.value)}
        rows={5}
        placeholder="Formulieren Sie hier Ihr Angebot..."
        className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowCreateModal(false);
            setAngebotText("");
          }}
          className="px-4 py-2 rounded-lg border hover:bg-gray-100"
        >
          Abbrechen
        </button>

        <button
          onClick={createAngebot}
          disabled={angebotText.trim() === ""}
          className={`px-4 py-2 rounded-lg text-white transition
            ${
              angebotText.trim() === ""
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
        >
          Bestätigen
        </button>
      </div>
    </div>
  </div>
)}

        <div className="pt-24 pb-32 h-[95vh] bg-light dark:bg-darkmode">
            <div className="pt-11 flex justify-center items-center text-center ">
       
                <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
                    <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
        <div>
            <>
                <div className="grid grid-cols-8 gap-2 font-semibold border-b pb-2">
                    <div>Stellplatz</div>
                    <div>Standort</div>
                    <div>Kundenname</div>
                    <div>Kunden-Email</div>
                    <div>Von</div>
                    <div>Bis</div>
                    <div> Status </div>
                    <div>Aktion</div>
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
                    <div>{r.flugzeugbesitzer.name}</div>
                    <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto pr-2">{r.flugzeugbesitzer.email}</div>
                    <div>{r.zeitraum.von}</div>
                    <div>{r.zeitraum.bis}</div>
                    <div>{r.accepted!=null ? r.accepted?"angenommen":"abgelehnt" : "noch nicht angegeben"}</div>
                    <div>{r.inhalt!=null ? (<button 
                        onClick={() => {
                        setSelected(r.id);
                        setShowModal(true);
                      }}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                        title="stornieren"
                    >
                        <Trash2 size={22} />
                    </button>) : (<button
                                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
                                    title="Angebot erfassen"
                                    onClick={() => {
                                        setSelected(r.id);
                                        setShowCreateModal(true);
                                    }}
                                >
                                    <Edit size={22} />
                                </button>)}
                    
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

export default Angebote;