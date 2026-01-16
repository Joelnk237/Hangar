"use client";

type FlugzeugInfoProps = {
  flugzeug: {
    kennzeichen: string;
    baujahr: number;
    flugzeugtyp: string;
    flugzeuggroesse: string;
    flugstunden: number;
    flugkilometer: number;
    treibstoffverbrauch: number;
    frachtkapazitaet: number;
  };

  hangar: {
    stellplatzKennzeichen: string;
    hangaranbieter: string;
    ort: string;
    services: string[];
    uebergabetermin: string;
    rueckgabetermin: string;
  };

  wartung: {
    fahrbereitschaft: string;
    wartungszustand: string;
  };

  onEdit?: () => void;
  onDelete?: () => void;
  onZusatzservice?: () => void;
  onAnfrage?: () => void;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="relative border-2 border-primary rounded-lg p-6 pt-8">
    <span className="absolute -top-3 left-4 bg-white dark:bg-semidark px-3 text-sm font-semibold text-primary">
      {title}
    </span>
    {children}
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

const FlugzeugInfo = ({
  flugzeug,
  hangar,
  wartung,
  onEdit,
  onDelete,
  onZusatzservice,
  onAnfrage,
}: FlugzeugInfoProps) => {
  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
    
    <div className="space-y-8">

      {/* ---------------- General ---------------- */}
      <Section title="General">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabelValue label="Kennzeichen:" value={flugzeug.kennzeichen} />
          <LabelValue label="Baujahr:" value={flugzeug.baujahr} />
          <LabelValue label="Flugzeugtyp:" value={flugzeug.flugzeugtyp} />
          <LabelValue label="Flugzeuggröße:" value={flugzeug.flugzeuggroesse} />
          <LabelValue label="Flugstunden:" value={flugzeug.flugstunden} />
          <LabelValue label="Flugkilometer:" value={flugzeug.flugkilometer} />
          <LabelValue
            label="Treibstoffverbrauch:"
            value={`${flugzeug.treibstoffverbrauch} L/h`}
          />
          <LabelValue
            label="Frachtkapazität:"
            value={`${flugzeug.frachtkapazitaet} kg`}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            bearbeiten
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            löschen
          </button>
        </div>
      </Section>

      {/* ---------------- Hangar Infos ---------------- */}
      <Section title="Hangar Infos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabelValue
            label="Stellplatz:"
            value={hangar.stellplatzKennzeichen}
          />
          <LabelValue
            label="Hangaranbieter:"
            value={hangar.hangaranbieter}
          />
          <LabelValue label="Ort:" value={hangar.ort} />
          <LabelValue
            label="Services:"
            value={hangar.services.join(", ")}
          />
          <LabelValue
            label="Übergabetermin:"
            value={hangar.uebergabetermin}
          />
          <LabelValue
            label="Rückgabetermin:"
            value={hangar.rueckgabetermin}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onZusatzservice}
            className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-white transition"
          >
            Zusatzservice buchen
          </button>
          <button
            onClick={onAnfrage}
            className="px-4 py-2 rounded border border-gray-500 text-gray-600 hover:bg-gray-600 hover:text-white transition"
          >
            Anfrage an Anbieter stellen
          </button>
        </div>
      </Section>

      {/* ---------------- Wartung ---------------- */}
      <Section title="Wartung & Sonstiges">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelValue
            label="Fahrbereitschaft:"
            value={wartung.fahrbereitschaft}
          />
          <LabelValue
            label="Wartungszustand:"
            value={wartung.wartungszustand}
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
