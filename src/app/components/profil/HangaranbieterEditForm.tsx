"use client";

import { useState } from "react";
import { HangaranbieterInfosTyp, HangaranbieterSpezialisierungen, HangarMerkmale } from "@/app/types/property/hangaranbieter";
import toast from "react-hot-toast";

type Props = {
  initialData: HangaranbieterInfosTyp;
  initialSpezialisierungen: HangaranbieterSpezialisierungen;
  onCancel: () => void;
  onSaved: (data: any) => void;
};

export default function HangaranbieterEditForm({
  initialData,
  initialSpezialisierungen,
  onCancel,
  onSaved,
}: Props) {

  const [formData, setFormData] = useState({
    firmenname: initialData.firmenname,
    ansprechpartner: initialData.ansprechpartner ?? "",
    email: initialData.email,
    tel: initialData.tel,
    strasse: initialData.strasse,
    hausnummer: initialData.hausnummer,
    plz: initialData.plz,
    ort: initialData.ort,
    hangarMerkmale: structuredClone(initialData.hangar_merkmale),
  });
    const [loading, setLoading] = useState(false);
  const [spezialisierungen, setSpezialisierungen] = useState(initialSpezialisierungen);
  const ALL_FLUGZEUGTYPEN = ["SEP", "MEP", "Helikopter", "Jet", "Turboprop", "Ultraleicht"] as const;
const ALL_FLUGZEUGGROESSEN = ["XS", "S", "M", "L", "XL"] as const;

type FlugzeugTyp = typeof ALL_FLUGZEUGTYPEN[number];
type FlugzeugGroesse = typeof ALL_FLUGZEUGGROESSEN[number];

const [flugzeugtypen, setFlugzeugtypen] = useState<FlugzeugTyp[]>(
  (initialSpezialisierungen?.flugzeugtypen ?? []).filter((t): t is FlugzeugTyp =>
    ALL_FLUGZEUGTYPEN.includes(t as FlugzeugTyp)
  )
);

const [flugzeuggroessen, setFlugzeuggroessen] = useState<FlugzeugGroesse[]>(
  (initialSpezialisierungen?.flugzeuggroessen ?? []).filter((g): g is FlugzeugGroesse =>
    ALL_FLUGZEUGGROESSEN.includes(g as FlugzeugGroesse)
  )
);


  

  const addFlugzeugtyp = (typ: FlugzeugTyp) => {
  setFlugzeugtypen(prev => prev.includes(typ) ? prev : [...prev, typ]);
};

const removeFlugzeugtyp = (typ: FlugzeugTyp) => {
  setFlugzeugtypen(prev => prev.filter(t => t !== typ));
};

const addGroesse = (g: FlugzeugGroesse) => {
  setFlugzeuggroessen(prev => prev.includes(g) ? prev : [...prev, g]);
};

const removeGroesse = (g: FlugzeugGroesse) => {
  setFlugzeuggroessen(prev => prev.filter(x => x !== g));
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
const toggleMerkmal = (key: keyof HangarMerkmale) => {
  setFormData(prev => ({
    ...prev,
    hangarMerkmale: {
      ...prev.hangarMerkmale,
      [key]: {
        ...prev.hangarMerkmale[key],
        enabled: !prev.hangarMerkmale[key].enabled,
      },
    },
  }));
};

const toggleMerkmalOption = <
  K extends keyof HangarMerkmale,
  O extends keyof HangarMerkmale[K]
>(
  category: K,
  option: O
) => {
  setFormData(prev => ({
    ...prev,
    hangarMerkmale: {
      ...prev.hangarMerkmale,
      [category]: {
        ...prev.hangarMerkmale[category],
        [option]: !prev.hangarMerkmale[category][option],
      },
    },
  }));
};

const validateHangarMerkmale = (merkmale: HangarMerkmale): string | null => {
  const checks = [
    {
      key: "wetterschutz",
      options: ["voll", "teil"],
      label: "Wetterschutz"
    },
    {
      key: "flugfeld",
      options: ["asphalt", "gras"],
      label: "Flugfeld"
    },
    {
      key: "zugang24h",
      options: ["code", "chip"],
      label: "24h Zugang"
    },
    {
      key: "wachschutz",
      options: ["alarm", "zutritt"],
      label: "Wachschutz"
    },
    {
      key: "video",
      options: ["live", "recording24h"],
      label: "Videozugriff"
    },
  ] as const;

  for (const c of checks) {
    const block = merkmale[c.key as keyof HangarMerkmale] as any;

    if (block.enabled) {
      const hasOne = c.options.some(opt => block[opt]);
      if (!hasOne) {
        return `Bitte mindestens eine Option für ${c.label} auswählen`;
      }
    }
  }

  return null;
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const error = validateHangarMerkmale(formData.hangarMerkmale);
  if (error) {
    toast.error(error);
    setLoading(false);
    return;
  }

  const payload = {
    ...formData,
    spezialisierungen: {
      flugzeugtypen,
      flugzeuggroessen
    }
  };

  try {
    const res = await fetch("http://localhost:8888/api/hangaranbieter/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();

      if (res.status === 409 && text === "EMAIL_ALREADY_USED") {
        toast.error("Diese Email existiert bereits im System");
        return;
      }

      if (text.startsWith("FLUGZEUGTYP_IN_USE")) {
        toast.error("Einer deiner Stellplätze benutzt noch den Flugzeugtyp: " + text.split(":")[1]);
        return;
      }

      if (text.startsWith("FLUGZEUGGROESSE_IN_USE")) {
        toast.error("Einer deiner Stellplätze benutzt noch die Größe: " + text.split(":")[1]);
        return;
      }

      throw new Error(text);
    }

    const updated = await res.text();
    onSaved(updated);
    toast.success("Profil erfolgreich aktualisiert ✅");
    window.location.reload();

  } catch (err) {
    console.error(err);
    toast.error("Update fehlgeschlagen");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="pt-24 pb-32 bg-light dark:bg-darkmode">
      <div className="max-w-4xl mx-auto bg-white dark:bg-semidark p-10 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-6">Profil bearbeiten</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold mb-2">General</h3>

          <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Firmenname"
                name="firmenname"
                value={formData.firmenname}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Ansprechpartner (Optional)"
                name="ansprechpartner"
                value={formData.ansprechpartner}
                onChange={handleChange}
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Telefonnummer"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>

          <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Straße"
                name="strasse"
                value={formData.strasse}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Hausnummer"
                name="hausnummer"
                value={formData.hausnummer}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Postleitzahl"
                name="plz"
                value={formData.plz}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Ort"
                name="ort"
                value={formData.ort}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
                <h3 className="font-semibold mb-2">Spezialisierungen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Flugzeugtypen Select */}
    <div>
      <label className="block text-sm font-medium mb-2">Flugzeugtypen auswählen</label>

      <select
        className="w-full rounded-md border px-4 py-2 bg-transparent"
        onChange={(e) => addFlugzeugtyp(e.target.value as FlugzeugTyp)}
        defaultValue=""
      >
        <option value="" disabled>Typ auswählen</option>
        {ALL_FLUGZEUGTYPEN.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {flugzeugtypen.map(t => (
          <span key={t} className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
            {t}
            <button
              type="button"
              onClick={() => removeFlugzeugtyp(t)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>


    {/* Flugzeuggrößen Select */}
    <div>
      <label className="block text-sm font-medium mb-2">Flugzeuggrößen auswählen</label>

      <select
        className="w-full rounded-md border px-4 py-2 bg-transparent"
        onChange={(e) => addGroesse(e.target.value as FlugzeugGroesse)}
        defaultValue=""
      >
        <option value="" disabled>Größe auswählen</option>
        {ALL_FLUGZEUGGROESSEN.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {flugzeuggroessen.map(g => (
          <span key={g} className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
            {g}
            <button
              type="button"
              onClick={() => removeGroesse(g)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>

  </div>
            </div>

          {/* Hangar Merkmale (reuse your checkbox UI) */}
          <div>
            <h3 className="font-semibold mb-2">Hangar Merkmale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Wetterschutz */}
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          name="wetterschutz"
          checked={formData.hangarMerkmale.wetterschutz.enabled}
          onChange={() => toggleMerkmal("wetterschutz")}
          className="h-5 w-5 accent-primary"
        />
        <span className="text-midnight_text dark:text-white">
          Wetterschutz vorhanden
        </span>
      </label>

      {formData.hangarMerkmale.wetterschutz.enabled && (
        <div className="mt-3 ml-8 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="wetterschutz_voll"
              checked={formData.hangarMerkmale.wetterschutz.voll}
              onChange={() => toggleMerkmalOption("wetterschutz", "voll")}
              className="h-4 w-4 accent-primary"
            />
            Vollständig geschlossen
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="wetterschutz_teil"
              checked={formData.hangarMerkmale.wetterschutz.teil}
              onChange={() => toggleMerkmalOption("wetterschutz", "teil")}
              className="h-4 w-4 accent-primary"
            />
            Teilweise überdacht
          </label>
        </div>
      )}
    </div>

    {/* Flugfeld */}
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          name="flugfeld"
          checked={formData.hangarMerkmale.flugfeld.enabled}
          onChange={() => toggleMerkmal("flugfeld")}
          className="h-5 w-5 accent-primary"
        />
        <span className="text-midnight_text dark:text-white">
          Flugfeld vorhanden
        </span>
      </label>

      {formData.hangarMerkmale.flugfeld.enabled && (
        <div className="mt-3 ml-8 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="flugfeld_asphalt"
              checked={formData.hangarMerkmale.flugfeld.asphalt}
              onChange={() => toggleMerkmalOption("flugfeld", "asphalt")}
              className="h-4 w-4 accent-primary"
            />
            Asphaltbahn
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="flugfeld_gras"
              checked={formData.hangarMerkmale.flugfeld.gras}
              onChange={() => toggleMerkmalOption("flugfeld", "gras")}
              className="h-4 w-4 accent-primary"
            />
            Graspiste
          </label>
        </div>
      )}
    </div>

    {/* 24h Zugang */}
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          name="zugang24h"
          checked={formData.hangarMerkmale.zugang24h.enabled}
          onChange={() => toggleMerkmal("zugang24h")}
          className="h-5 w-5 accent-primary"
        />
        <span className="text-midnight_text dark:text-white">
          24h Zugang
        </span>
      </label>

      {formData.hangarMerkmale.zugang24h.enabled && (
        <div className="mt-3 ml-8 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="zugang_code"
              checked={formData.hangarMerkmale.zugang24h.code}
              onChange={() => toggleMerkmalOption("zugang24h", "code")}
              className="h-4 w-4 accent-primary"
            />
            Zugang per Code
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="zugang_chip"
              checked={formData.hangarMerkmale.zugang24h.chip}
              onChange={() => toggleMerkmalOption("zugang24h", "chip")}
              className="h-4 w-4 accent-primary"
            />
            Zugang per Chipkarte
          </label>
        </div>
      )}
    </div>

    {/* Wachschutz */}
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          name="wachschutz"
          checked={formData.hangarMerkmale.wachschutz.enabled}
          onChange={() => toggleMerkmal("wachschutz")}
          className="h-5 w-5 accent-primary"
        />
        <span className="text-midnight_text dark:text-white">
          Wachschutz vorhanden
        </span>
      </label>

      {formData.hangarMerkmale.wachschutz.enabled && (
        <div className="mt-3 ml-8 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="wachschutz_alarm"
              checked={formData.hangarMerkmale.wachschutz.alarm}
              onChange={() => toggleMerkmalOption("wachschutz", "alarm")}
              className="h-4 w-4 accent-primary"
            />
            Alarmanlage
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="wachschutz_zutritt"
              checked={formData.hangarMerkmale.wachschutz.zutritt}
              onChange={() => toggleMerkmalOption("wachschutz", "zutritt")}
              className="h-4 w-4 accent-primary"
            />
            Zutrittskontrolle
          </label>
        </div>
      )}
    </div>

    {/* Videozugriff */}
    <div className="md:col-span-2 rounded-md border border-border dark:border-darkborder p-4">
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          name="videozugriff"
          checked={formData.hangarMerkmale.video.enabled}
          onChange={() => toggleMerkmal("video")}
          className="h-5 w-5 accent-primary"
        />
        <span className="text-midnight_text dark:text-white">
          Videozugriff / Livefeed
        </span>
      </label>

      {formData.hangarMerkmale.video.enabled && (
        <div className="mt-3 ml-8 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="video_live"
              checked={formData.hangarMerkmale.video.live}
              onChange={() => toggleMerkmalOption("video", "live")}
              className="h-4 w-4 accent-primary"
            />
            Livefeed verfügbar
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="video_24h"
              checked={formData.hangarMerkmale.video.recording24h}
              onChange={() => toggleMerkmalOption("video", "recording24h")}
              className="h-4 w-4 accent-primary"
            />
            24h Aufzeichnung
          </label>
        </div>
      )}
    </div>

  </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Abbrechen
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white hover:bg-DarkPrimary"
            >
              Änderung speichern {loading && "..."}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
