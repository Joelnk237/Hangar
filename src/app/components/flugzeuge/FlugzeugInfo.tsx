"use client";
import { FlugzeugInfoProps } from "@/app/types/property/flugzeug";


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

  const hasStellplatz = flugzeugInfos.flugzeug.status === true;
  return (
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
                            {service.preis} {service.einheit}
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
            value={flugzeugInfos.hangar.uebergabetermin}
          />
          <LabelValue
            label="Rückgabetermin:"
            value={flugzeugInfos.hangar.rueckgabetermin}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
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
  );
};

export default FlugzeugInfo;
