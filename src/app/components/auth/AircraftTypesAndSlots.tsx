"use client";
import { useState } from "react";

type FlugzeugTypEintrag = {
  typ: "SEP" | "MEP" | "Helikopter" | "Jet" | "Turboprop" | "Ultraleicht";
  stellplaetze: number;
};

type FlugzeugGroesseEintrag = {
  groesse: "XS" | "S" | "M" | "L" | "XL";
  stellplaetze: number;
};

type AircraftTypesAndSlotsProps = {
  value: {
    flugzeugtypen: FlugzeugTypEintrag[];
    flugzeuggroessen: FlugzeugGroesseEintrag[];
  };
  onChange: (updated: {
    flugzeugtypen: FlugzeugTypEintrag[];
    flugzeuggroessen: FlugzeugGroesseEintrag[];
  }) => void;
};

const availableTypes: FlugzeugTypEintrag["typ"][] = [
  "SEP",
  "MEP",
  "Helikopter",
  "Jet",
  "Turboprop",
  "Ultraleicht",
];

const availableSizes: FlugzeugGroesseEintrag["groesse"][] = ["XS", "S", "M", "L", "XL"];

const AircraftTypesAndSlots = ({ value, onChange }: AircraftTypesAndSlotsProps) => {
  const [newType, setNewType] = useState<FlugzeugTypEintrag["typ"]>("SEP");
  const [newTypeSlots, setNewTypeSlots] = useState<number>(1);

  const [newSize, setNewSize] = useState<FlugzeugGroesseEintrag["groesse"]>("S");
  const [newSizeSlots, setNewSizeSlots] = useState<number>(1);

  // Ajouter un type
  const addType = () => {
    if (value.flugzeugtypen.find((t) => t.typ === newType)) return;
    const updated = [...value.flugzeugtypen, { typ: newType, stellplaetze: newTypeSlots }];
    onChange({ ...value, flugzeugtypen: updated });
  };

  // Supprimer un type
  const removeType = (typ: FlugzeugTypEintrag["typ"]) => {
    const updated = value.flugzeugtypen.filter((t) => t.typ !== typ);
    onChange({ ...value, flugzeugtypen: updated });
  };

  // Ajouter une taille
  const addSize = () => {
    if (value.flugzeuggroessen.find((s) => s.groesse === newSize)) return;
    const updated = [...value.flugzeuggroessen, { groesse: newSize, stellplaetze: newSizeSlots }];
    onChange({ ...value, flugzeuggroessen: updated });
  };

  // Supprimer une taille
  const removeSize = (groesse: FlugzeugGroesseEintrag["groesse"]) => {
    const updated = value.flugzeuggroessen.filter((s) => s.groesse !== groesse);
    onChange({ ...value, flugzeuggroessen: updated });
  };

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold mb-4 text-midnight_text dark:text-white">
        Spezialisierungen
      </h3>

      {/* SECTION TYPES */}
      <div className="mb-6">
        
        <h3 className="text-base font-semibold mb-4 text-midnight_text dark:text-white">Flugzeugtypen</h3>
        <div className="flex gap-2 mb-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as FlugzeugTypEintrag["typ"])}
            className="rounded-md border border-border px-2 py-1"
          >
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={newTypeSlots}
            onChange={(e) => setNewTypeSlots(Number(e.target.value))}
            placeholder="Stellplätze"
            className="rounded-md border border-border px-2 py-1 w-24"
          />
          <button type="button" onClick={addType} className="bg-primary text-white px-3 py-1 rounded-md">
            Hinzufügen
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.flugzeugtypen.map((t) => (
            <div key={t.typ} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
              <span>{t.typ} ({t.stellplaetze})</span>
              <button type="button" onClick={() => removeType(t.typ)} className="text-red-500 font-bold">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION SIZES */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-midnight_text dark:text-white">Flugzeuggröße</h3>
        <div className="flex gap-2 mb-2">
          <select
            value={newSize}
            onChange={(e) => setNewSize(e.target.value as FlugzeugGroesseEintrag["groesse"])}
            className="rounded-md border border-border px-2 py-1"
          >
            {availableSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={newSizeSlots}
            onChange={(e) => setNewSizeSlots(Number(e.target.value))}
            placeholder="Stellplätze"
            className="rounded-md border border-border px-2 py-1 w-24"
          />
          <button type="button" onClick={addSize} className="bg-primary text-white px-3 py-1 rounded-md">
            Hinzufügen
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {value.flugzeuggroessen.map((s) => (
            <div key={s.groesse} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
              <span>{s.groesse} ({s.stellplaetze})</span>
              <button type="button" onClick={() => removeSize(s.groesse)} className="text-red-500 font-bold">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AircraftTypesAndSlots;
