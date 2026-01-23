"use client";
import { FlugzeugInfoProps } from "@/app/types/property/flugzeug";
import { useState } from "react";
import toast from "react-hot-toast";
import { Edit } from "lucide-react";

const Section = ({
  title,
  children,
  disabled = false,
  disabledMessage,
}: {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
}) => (
  <div className="relative border-2 border-primary rounded-lg p-6 pt-8">
    <span className="absolute -top-3 left-4 bg-white dark:bg-semidark px-3 text-sm font-semibold text-primary">
      {title}
    </span>
    <div
      className={`transition ${
        disabled ? "blur-sm opacity-60 pointer-events-none select-none" : ""
      }`}
    >
      {children}
    </div>

    {/* Overlay message */}
    {disabled && disabledMessage && (
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white dark:bg-semidark border border-primary rounded-md px-6 py-4 text-center shadow-lg max-w-md">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            {disabledMessage}
          </p>
        </div>
      </div>
    )}
  </div>
);

const LabelValue = ({ label, value }: { label: string; value: any }) => (
  <div className="flex gap-2">
    <span className="font-medium text-gray-600 dark:text-gray-300">
      {label}
    </span>
    <span className="text-gray-900 dark:text-white">{value}</span>
  </div>
);

const FlugzeugInfo = ({ flugzeugInfos }: { flugzeugInfos: FlugzeugInfoProps }) => {

  const [showZusatzModal, setShowZusatzModal] = useState(false);
  const [loadingZusatz, setLoadingZusatz] = useState(false);
  const [zusatzservices, setZusatzservices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showTerminModal, setShowTerminModal] = useState(false);
const [terminDate, setTerminDate] = useState("");
const [terminTime, setTerminTime] = useState("");
const [istUebergabe, setIstUebergabe] = useState<boolean>(true);
const [terminLoading, setTerminLoading] = useState(false);



  const handleOpenZusatzservices = async () => {
  setShowZusatzModal(true);
  setLoadingZusatz(true);
  setError(null);

  try {

    const res = await fetch(
      `http://localhost:8888/api/hangaranbieter/${flugzeugInfos.hangar.hangaranbieterId}/zusatzservices`,
      {}
    );

    if (!res.ok) {
      throw new Error("Fehler beim Laden der Zusatzservices");
    }

    const allServices = await res.json();

    // IDs von schon gebuchten Zusatzservices
    const bookedIds = new Set(
      flugzeugInfos.hangar.zusatzservices.map(z => z.id)
    );

    // filtern
    const available = allServices.filter(
      (s: any) => !bookedIds.has(s.id)
    );

    setZusatzservices(available);
  } catch (err: any) {
    console.error(err);
    setError(err.message);
    toast.error(err.message);
  } finally {
    setLoadingZusatz(false);
  }
};

const handleBookZusatzservice = async (zusatzserviceId: number) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      zusatzservice_id: zusatzserviceId,
      stellplatz_id: flugzeugInfos.hangar.stellplatz_id,
      flugzeug_id: flugzeugInfos.flugzeug.id,
    };

    const res = await fetch(
      "http://localhost:8888/api/zusatzservices/buchen",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error("Buchung fehlgeschlagen");
    }

    setShowZusatzModal(false);
    toast.success("Zusatzservice erfolgreich gebucht!")
    window.location.reload(); // reloading
  } catch (err) {
    console.error(err);
    toast.error("Fehler bei der Buchung");
  }
};

const isDateInRange = (dateTime: Date) => {
  const von = new Date(flugzeugInfos.hangar.von);
  const bis = new Date(flugzeugInfos.hangar.bis);

  return dateTime >= von && dateTime <= bis;
};

const handleConfirmTermin = async () => {
  if (!terminDate || !terminTime) {
    toast.error("Bitte Datum und Uhrzeit auswählen");
    return;
  }

  const terminDateTime = new Date(`${terminDate}T${terminTime}`);

  if (!isDateInRange(terminDateTime)) {
    toast.error("Der Termin liegt außerhalb des Reservierungszeitraums");
    return;
  }

  setTerminLoading(true);

  try {
    const token = localStorage.getItem("token");

    const payload = {
      termin_zeitpunkt: terminDateTime.toISOString(),
      ist_uebergabe: istUebergabe,
      hangaranbieter_id: flugzeugInfos.hangar.hangaranbieterId,
      stellplatz_id: flugzeugInfos.hangar.stellplatz_id,
    };

    const res = await fetch("http://localhost:8888/api/termine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Termin konnte nicht gespeichert werden");
    }

    toast.success("Termin erfolgreich gespeichert");
    setShowTerminModal(false);
    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error("Fehler beim Speichern des Termins");
  } finally {
    setTerminLoading(false);
  }
};
const formatTermin = (isoString: string) => {
  const date = new Date(isoString);

  return date.toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};





  const hasStellplatz = flugzeugInfos.flugzeug.status === true;
  return (
  <>
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
    
    <div className="space-y-8">

      {/* ---------------- General ---------------- */}
      <Section title="General">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabelValue label="Kennzeichen:" value={flugzeugInfos.flugzeug.kennzeichen} />
          <LabelValue label="Baujahr:" value={flugzeugInfos.flugzeug.baujahr} />
          <LabelValue label="Flugzeugtyp:" value={flugzeugInfos.flugzeug.flugzeugtyp} />
          <LabelValue label="Flugzeuggröße:" value={flugzeugInfos.flugzeug.flugzeuggroesse} />
          <LabelValue label="Flugstunden:" value={flugzeugInfos.flugzeug.flugstunden} />
          <LabelValue label="Flugkilometer:" value={flugzeugInfos.flugzeug.flugkilometer} />
          <LabelValue label="Abmaße:" value={flugzeugInfos.flugzeug.abmasse != null?`Flügelspannweite:${flugzeugInfos.flugzeug.abmasse.fluegelspannweite}, Länge:${flugzeugInfos.flugzeug.abmasse.laenge}, Höhe::${flugzeugInfos.flugzeug.abmasse.hoehe}` : null} />
          <LabelValue label="Kategorie:" value={null} />
          <LabelValue
            label="Treibstoffverbrauch:"
            value={`${flugzeugInfos.flugzeug.treibstoffverbrauch} L/h`}
          />
          <LabelValue
            label="Frachtkapazität:"
            value={`${flugzeugInfos.flugzeug.frachtkapazitaet} kg`}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            bearbeiten
          </button>
          <button
            className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            löschen
          </button>
        </div>
      </Section>

      {/* ---------------- Hangar Infos ---------------- */}
      <Section title="Hangar Infos"
        disabled={!hasStellplatz}
        disabledMessage="Dieses Flugzeug ist derzeit keinem Stellplatz zugewiesen."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabelValue
            label="Stellplatz:"
            value={flugzeugInfos.hangar.stellplatzKennzeichen}
          />
          <LabelValue
            label="Hangaranbieter:"
            value={flugzeugInfos.hangar.hangaranbieter}
          />
          <LabelValue label="Ort:" value={flugzeugInfos.hangar.ort} />
          <LabelValue
            label="Services:"
            value={flugzeugInfos.hangar.services.length > 0 ? (
                    <ul className="space-y-1">
                      {flugzeugInfos.hangar.services.map((service, index) => (
                        <li
                          key={index}
                          className="flex justify-between gap-6 border-b border-gray-200 dark:border-gray-700 pb-1"
                        >
                          <span>{service.bezeichnung}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {service.preis}€ {service.einheit}
                          </span>
                        </li>
                      ))}
                      {flugzeugInfos.hangar.zusatzservices.map((service, index) => (
                        <li
                          key={index}
                          className="flex justify-between gap-6 border-b border-gray-200 dark:border-gray-700 pb-1"
                        >
                          <span>{service.bezeichnung}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {service.preis}€ {service.einheit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400">
                      Keine Services verfügbar
                    </span>
                  )}
          />
          <LabelValue
            label="reserviert von:"
            value={flugzeugInfos.hangar.von}
          />
          <LabelValue
            label="bis:"
            value={flugzeugInfos.hangar.bis}
          />
          <LabelValue
            label="Übergabetermin:"
            value={flugzeugInfos.hangar.uebergabetermin != null ? formatTermin(flugzeugInfos.hangar.uebergabetermin) 
              : (<button onClick={() => {
                  setIstUebergabe(true);
                  setShowTerminModal(true);
                }} 
              className="rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="Übergabetermin auswählen"><Edit/></button>)}
          />
          <LabelValue
            label="Rückgabetermin:"
            value={flugzeugInfos.hangar.rueckgabetermin!= null ? formatTermin(flugzeugInfos.hangar.rueckgabetermin) 
              : (<button onClick={() => {
              setIstUebergabe(false);
              setShowTerminModal(true);
            }} 
            className=" rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="Rückgabetermin auswählen"><Edit/></button>)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleOpenZusatzservices}
            className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            Zusatzservice buchen
          </button>
          <button
            className="px-4 py-2 rounded border border-gray-500 text-gray-600 hover:bg-gray-600 hover:text-white transition"
          >
            Anfrage an Anbieter stellen
          </button>
        </div>
      </Section>

      {/* ---------------- Zustand ---------------- */}
      <Section title="Wartung & Sonstiges"
        disabled={!hasStellplatz}
        disabledMessage="Dieses Flugzeug ist derzeit keinem Stellplatz zugewiesen."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelValue
            label="Fahrbereitschaft:"
            value={flugzeugInfos.zustand.fahrbereitschaft}
          />
          <LabelValue
            label="Beschreibung:"
            value={flugzeugInfos.zustand.beschreibung}
          />
          <LabelValue
            label="Wartungszustand:"
            value={flugzeugInfos.zustand.wartungszustand}
          />
        </div>
      </Section>

    </div>
    </div>
    </div>
    </div>
    
    {/**MODAL */}

    {showZusatzModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-semidark rounded-lg p-6 w-full max-w-lg space-y-4">

      <h2 className="text-lg font-semibold">
        Zusatzservice auswählen
      </h2>

      {loadingZusatz && (
        <p className="text-gray-500">Lade Zusatzservices…</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loadingZusatz && zusatzservices.length === 0 && (
        <p className="text-gray-500 italic">
          Keine zusätzlichen Services verfügbar
        </p>
      )}

      <ul className="space-y-3 max-h-80 overflow-y-auto">
        {zusatzservices.map((s) => (
          <li
            key={s.id}
            className="border rounded p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => handleBookZusatzservice(s.id)}
          >
            <div className="font-medium">{s.bezeichnung}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {s.beschreibung}
            </div>
            <div className="text-sm mt-1">
              {s.preis} € / {s.einheit}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <button
          onClick={() => setShowZusatzModal(false)}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Abbrechen
        </button>
      </div>
    </div>
  </div>
)}

    {showTerminModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-semidark rounded-lg p-6 w-full max-w-md space-y-4">

      <h2 className="text-lg font-semibold">
        {istUebergabe ? "Übergabetermin wählen" : "Rückgabetermin wählen"}
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Datum</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={terminDate}
            onChange={(e) => setTerminDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Uhrzeit</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={terminTime}
            onChange={(e) => setTerminTime(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setShowTerminModal(false)}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Abbrechen
        </button>

        <button
          disabled={terminLoading}
          onClick={handleConfirmTermin}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
        >
          Bestätigen
        </button>
      </div>
    </div>
  </div>
)}

    
    </>
  );
};

export default FlugzeugInfo;
