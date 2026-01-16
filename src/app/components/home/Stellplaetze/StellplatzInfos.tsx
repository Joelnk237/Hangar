"use client";

import Image from "next/image";

type Merkmale = {
  [key: string]: {
    enabled: boolean;
    [subKey: string]: boolean;
  };
};

type Services = {
  [key: string]: {
    price: number;
    unit: string;
  };
};

type StellplatzInfosProps = {
  stellplatz: {
    anbieterName: string;
    ort: string;
    availability: string;
    bild: string | null;

    flugzeugtyp: string;
    flugzeuggroesse: string;

    merkmale: Merkmale;
    services: Services;
    besonderheiten: string;
  };
};

const StellplatzInfos = ({
  stellplatz
}: StellplatzInfosProps) => {
  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
    <div className="bg-white dark:bg-semidark rounded-lg overflow-hidden shadow-md">

      {/* Image */}
      <div className="relative w-full h-64">
        {stellplatz.bild ? (
          <Image
            src={stellplatz.bild}
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
          <h3 className="font-semibold mb-2">Hangar-Merkmale:</h3>
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
          <h3 className="font-semibold mb-2">Services am Stellplatz:</h3>
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
          <span className="font-semibold">verfügbar ab: </span>
          <span>{new Date(stellplatz.availability).toLocaleDateString()}</span>
        </div>

        {/* Besonderheiten */}
        <div>
          <h3 className="font-semibold mb-2">Besonderheiten</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {stellplatz.besonderheiten || "Keine Besonderheiten angegeben."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-end pt-4 border-t">
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Angebot anfordern
          </button>

          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
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
