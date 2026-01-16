"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../shared/Loader";

type FlugzeugFormProps = {
  mode: "create" | "edit";
  initialData?: FlugzeugFormData;
  onSuccess?: () => void;
};

export type FlugzeugFormData = {
  kennzeichen: string;
  baujahr: number | "";
  bild: File | null;

  flugzeugtyp: string;
  flugzeuggroesse: string;

  flugstunden: number | "";
  flugkilometer: number | "";
  treibstoffverbrauch: number | "";
  frachtkapazitaet: number | "";
};

const flugzeugKonfig = {
  flugzeugtypen: ["SEP", "MEP", "Helikopter", "Turboprop", "Jet"],
  flugzeuggroessen: ["XS", "S", "M", "L", "XL"],
};

const FlugzeugForm = ({ mode, initialData, onSuccess }: FlugzeugFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FlugzeugFormData>({
    kennzeichen: "",
    baujahr: "",
    bild: null,
    flugzeugtyp: "",
    flugzeuggroesse: "",
    flugstunden: "",
    flugkilometer: "",
    treibstoffverbrauch: "",
    frachtkapazitaet: "",
  });

  /* -------- Initialisierung bei Edit -------- */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({ ...initialData, bild: null });
    }
  }, [mode, initialData]);

  /* -------- Handler -------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      bild: e.target.files ? e.target.files[0] : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
      };

      const res = await fetch(
        mode === "create"
          ? "http://localhost:8888/api/flugzeuge"
          : "http://localhost:8888/api/flugzeuge/update",
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Fehler beim Speichern des Flugzeugs");
      }

      onSuccess?.();
      router.push("/dashboard/flugzeuge");
    } catch (err: any) {
      alert(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
      <form onSubmit={handleSubmit}>

        {/* ---------------- Allgemeine Daten ---------------- */}
        <h3 className="text-base text-midnight_text font-semibold mb-3 text-midnight_text dark:text-white">Allgemeine Daten</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="kennzeichen"
            placeholder="Kennzeichen"
            value={formData.kennzeichen}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />

          <input
            type="number"
            name="baujahr"
            placeholder="Baujahr"
            value={formData.baujahr}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />

          <input
            type="file"
            name="bild"
            onChange={handleFileChange}
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary col-span-2"
          />
        </div>

        {/* ---------------- Kategorie ---------------- */}
        <h3 className="text-base text-midnight_text font-semibold mb-3 text-midnight_text dark:text-white">Kategorie</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            name="flugzeugtyp"
            value={formData.flugzeugtyp}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          >
            <option value="">Flugzeugtyp auswählen</option>
            {flugzeugKonfig.flugzeugtypen.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            name="flugzeuggroesse"
            value={formData.flugzeuggroesse}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          >
            <option value="">Flugzeugsgröße auswählen</option>
            {flugzeugKonfig.flugzeuggroessen.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* ---------------- Betriebsdaten ---------------- */}
        <h3 className="text-base text-midnight_text font-semibold mb-3 text-midnight_text dark:text-white">Betriebsdaten</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="number"
            name="flugstunden"
            placeholder="Flugstunden"
            value={formData.flugstunden}
            onChange={handleChange}
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />

          <input
            type="number"
            name="flugkilometer"
            placeholder="Flugkilometer"
            value={formData.flugkilometer}
            onChange={handleChange}
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />

          <input
            type="number"
            name="treibstoffverbrauch"
            placeholder="Treibstoffverbrauch (L/h)"
            value={formData.treibstoffverbrauch}
            onChange={handleChange}
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />

          <input
            type="number"
            name="frachtkapazitaet"
            placeholder="Frachtkapazität (kg)"
            value={formData.frachtkapazitaet}
            onChange={handleChange}
            className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md"
        >
          {mode === "create" ? "Flugzeug erstellen" : "Änderung speichern"}
          {loading && <Loader />}
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default FlugzeugForm;
