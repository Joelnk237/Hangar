"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Flugzeug } from "@/app/types/property/flugzeug";
import { useRouter } from "next/navigation";

import { StellplatzInfosProps } from "@/app/types/property/stellplatzData";
import toast, { Toaster } from 'react-hot-toast';

const StellplatzInfos = ({ stellplatz }: { stellplatz: StellplatzInfosProps }) => {
  const router= useRouter();
  const [showFlugzeugModal, setShowFlugzeugModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [isReservierung, setIsReservierung] = useState(false);

  const [flugzeuge, setFlugzeuge] = useState<Flugzeug[]>([]);
  const [selectedFlugzeugId, setSelectedFlugzeugId] = useState<string | null>(null);

  const [von, setVon] = useState("");
  const [bis, setBis] = useState("");



  const handleBuchenClick = async () => {
    setIsReservierung(true);
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8888/api/flugzeuge", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Fehler beim Laden der Flugzeuge");

    const data: Flugzeug[] = await res.json();

    // nur freie Flugzeuge
    const freieFlugzeuge = data.filter(f => !f.status);

    setFlugzeuge(freieFlugzeuge);
    setShowFlugzeugModal(true);

  } catch (err) {
    console.error(err);
  }

};

const handleAngebotsanfrageClick = async () => {
  setIsReservierung(false);
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8888/api/flugzeuge", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Fehler beim Laden der Flugzeuge");

    const data: Flugzeug[] = await res.json();

    // nur freie Flugzeuge
    const freieFlugzeuge = data.filter(f => !f.status);

    setFlugzeuge(freieFlugzeuge);
    setShowFlugzeugModal(true);

  } catch (err) {
    console.error(err);
    console.log("ECHEC DE LA REQUETE")
    toast.error("Flugzeuge konnten nicht geladen werden");
  }

};

const handleConfirmAngebotsanfrage = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      flugzeug_id: selectedFlugzeugId,
      stellplatz_id: stellplatz.id,
      hangaranbieter_id: stellplatz.anbieterId,
      von,
      bis,
    };

    const res = await fetch("http://localhost:8888/api/angebote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Anfrage fehlgeschlagen");

    toast.success("Angebotsanfrage erfolgreich abgeschickt !");
    setShowDateModal(false);
    router.push("/");

  } catch (err) {
    console.error(err);
    toast.error("Fehler beim Zusenden der Angebotsanfrage");
  }
};

const handleConfirmReservation = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    const payload = {
      flugzeugId: selectedFlugzeugId,
      stellplatzId: stellplatz.id,
      flugzeugbesitzerId: user.id,
      von,
      bis,
    };

    const res = await fetch("http://localhost:8888/api/reservierungen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Reservierung fehlgeschlagen");

    toast.success("Stellplatz erfolgreich reserviert!");
    setShowDateModal(false);
    router.push("/");

  } catch (err) {
    console.error(err);
    toast.error("Fehler bei der Reservierung");
  }
};





  return (
    <>
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
    <div className="bg-white dark:bg-semidark rounded-lg overflow-hidden shadow-md">

      {/* Image */}
      <div className="relative w-full h-64">
        {stellplatz.bild ? (
          <Image
            src={stellplatz.bild ? `http://localhost:8888${stellplatz.bild}`
      : "/images/properties/stellplatz-placeholder.jpg"}
            alt="Stellplatz Bild"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Kein Bild verfügbar
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">

        {/* Infos Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Ort:" value={stellplatz.ort} />
          <InfoRow label="Hangaranbieter:" value={stellplatz.anbieterName} />
          <InfoRow label="Flugzeugtyp:" value={stellplatz.flugzeugtyp} />
          <InfoRow label="Flugzeuggröße:" value={stellplatz.flugzeuggroesse} />
        </div>

        {/* Merkmale */}
        <div>
          <h4 className="font-semibold mb-6 text-midnight_text dark:mb-2">Einstellbedingungen:</h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(stellplatz.merkmale)
              .filter(([_, m]) => m.enabled)
              .map(([name, details]) => (
                <li key={name}>
                  <span className="capitalize font-medium">{name}</span>
                  {" – "}
                  {Object.entries(details)
                    .filter(([k, v]) => k !== "enabled" && v)
                    .map(([k]) => k)
                    .join(", ")}
                </li>
              ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold dark:mb-2 mb-6 text-midnight_text">Services am Stellplatz:</h4>
          <ul className="space-y-1">
            {Object.entries(stellplatz.services).map(([name, s]) => (
              <li key={name} className="flex justify-between">
                <span className="capitalize">{name}</span>
                <span className="text-gray-600">
                  {s.price} € / {s.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-semibold dark:mb-2 mb-6 text-midnight_text">Zusatzservices</h4>(erst nach Reservierung buchbar)
          <ul className="space-y-1">
            {Object.entries(stellplatz.zusatzservices).map(([name, s]) => (
              <li key={name} className="flex justify-between">
                <span className="capitalize">{s.bezeichnung}</span>
                <span className="text-gray-600">
                  {s.preis} € / {s.einheit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Besonderheiten */}
        <div>
          <h4 className="font-semibold mb-6 text-midnight_text dark:mb-2">Besonderheiten</h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {stellplatz.besonderheiten || "Keine Besonderheiten angegeben."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-end pt-4 border-t">
          <button
            onClick={handleAngebotsanfrageClick}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Angebot anfordern
          </button>

          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleBuchenClick}
          >
            buchen
          </button>

          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            DetailInfos anfordern
          </button>
        </div>

      </div>
    </div>
    </div>
    </div>
    </div>

        {showFlugzeugModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray rounded-lg p-6 w-full max-w-md space-y-4">

          <h2 className="text-lg font-semibold">
            Welches Flugzeug möchten Sie auf diesem Stellplatz abstellen?
          </h2>

          {flugzeuge.length === 0 ? (
            <p className="text-gray-600">
              Sie verfügen über kein verfügbares Flugzeug für diesen Stellplatz.
            </p>
          ) : (
            <ul className="space-y-2">
              {flugzeuge.map(f => (
                <li key={f.id}>
                  <button
                    className="w-full border rounded px-4 py-2 hover:bg-blue-100"
                    onClick={() => {
                      setSelectedFlugzeugId(f.id);
                      setShowFlugzeugModal(false);
                      setShowDateModal(true);
                    }}
                  >
                    {f.kennzeichen}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="text-sm text-gray-500"
            onClick={() => setShowFlugzeugModal(false)}
          >
            Abbrechen
          </button>

        </div>
      </div>
    )}


    {showDateModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray rounded-lg p-6 w-full max-w-md space-y-4">

      <h2 className="text-lg font-semibold">
        {isReservierung?"Reservierungszeitraum":"Gewünschter Zeitraum"} auswählen
      </h2>

      <div className="flex flex-col gap-2">
        <label>
          Von:
          <input
            type="date"
            value={von}
            onChange={(e) => setVon(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label>
          Bis:
          <input
            type="date"
            value={bis}
            onChange={(e) => setBis(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDateModal(false)}
          className="px-3 py-1 border rounded"
        >
          Abbrechen
        </button>
        {isReservierung ? (<button
          onClick={handleConfirmReservation}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Reservieren
        </button>):(<button
          onClick={handleConfirmAngebotsanfrage}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Abschicken
        </button>)}
        
      </div>

    </div>
  </div>
)}


    </>
  );
};

export default StellplatzInfos;

/* ---------- Helper ---------- */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="font-semibold">{label}</span>
    <span>{value}</span>
  </div>
);
