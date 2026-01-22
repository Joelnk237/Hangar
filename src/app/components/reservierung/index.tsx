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
    const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<{
    stellplatzId: string;
    flugzeugId: string;
  } | null>(null);


  const deleteReservierung = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:8888/api/hangaranbieter/reservierungen",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stellplatzId: selected.stellplatzId,
            flugzeugId: selected.flugzeugId,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setShowModal(false);
      setSelected(null);

      // 
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Fehler beim Stornieren der Reservierung");
    }
  };



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
        {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-semidark rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Reservierung stornieren
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Sind Sie sicher, dass Sie diese Reservierung stornieren möchten?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Abbrechen
              </button>
              <button
                onClick={deleteReservierung}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
                        onClick={() => {
                        setSelected({
                          stellplatzId: r.stellplatz.id,
                          flugzeugId: r.flugzeug.id,
                        });
                        setShowModal(true);
                      }}
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