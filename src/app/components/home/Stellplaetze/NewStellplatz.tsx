"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../shared/Loader";
/* ------------------ CONFIG HANGARANBIETER ------------------ */


type AnbieterInfos = {
  flugzeugtyp: string[];
  flugzeugsgrösse: string[];
  services: Record<
    string,
    { price: number; unit: string }
  >;
};

/* ------------------ TYPES ------------------ */

type Mode = "create" | "edit";

type StellplatzInfos = {
  id:String,
  services: Record<
    string,
    { enabled: boolean; price: number; unit: string }
  >;
  flugzeugtyp: string;
  flugzeugsgrösse: string;
  kennzeichen?: string;
  standort?: string;
  besonderheit?: string;
};

const flugzeugGroessenConfig = {
    XS: "Abmaße: Flügelspannweite < 10 m | Länge < 6 m | Höhe < 2,5 m",
    S: "Abmaße: Flügelspannweite 10–15 m | Länge 6–8 m | Höhe 2,5–3,5 m",
    M: "Abmaße: Flügelspannweite 15–20 m | Länge 8–12 m | Höhe 3,5–5 m",
    L: "Abmaße: Flügelspannweite 20–25 m | Länge 12–16 m | Höhe 5–7 m",
    XL: "Abmaße: Flügelspannweite > 25 m | Länge > 16 m | Höhe > 7 m",
  };

type FormData = {
  kennzeichen: string;
  standort: string;
  besonderheit: string;
  bild: File | null;
  flugzeugtyp: string;
  flugzeuggroesse: string;
  services: Record<string, boolean>;
};

type StellplatzFormProps = {
  mode: Mode;
  stellplatzInfos?: StellplatzInfos;
};

/* ------------------ COMPONENT ------------------ */

const StellplatzForm = ({ mode, stellplatzInfos }: StellplatzFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hAnbieterInfos, setHAnbieterInfos] =
  useState<AnbieterInfos | null>(null);

  const [formData, setFormData] = useState<FormData>({
    kennzeichen: "",
    standort: "",
    besonderheit: "",
    bild: null,
    flugzeugtyp: "",
    flugzeuggroesse: "",
    services:{},
  });

  /* -----------  MODE EDIT ----------- */

  useEffect(() => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  Promise.all([
    fetch("http://localhost:8888/api/hangaranbieter/spezialisierungen", {
      headers,
    }).then(res => res.json()),

    fetch("http://localhost:8888/api/hangaranbieter/services", {
      headers,
    }).then(res => res.json()),
  ])
    .then(([spez, services]) => {
      const servicesMap: Record<string, { price: number; unit: string }> = {};

      services.forEach((s: any) => {
        servicesMap[s.bezeichnung] = {
          price: s.preis,
          unit: s.einheit,
        };
      });

      setHAnbieterInfos({
        flugzeugtyp: spez.flugzeugtypen,
        flugzeugsgrösse: spez.flugzeuggroessen,
        services: servicesMap,
      });

      // Initialiser les services du formulaire
      setFormData(prev => ({
        ...prev,
        services: Object.keys(servicesMap).reduce(
          (acc, k) => ({ ...acc, [k]: false }),
          {}
        ),
      }));
    })
    .catch(err => {
      console.error("Fehler beim Laden der Anbieter-Daten", err);
    });
}, []);


  useEffect(() => {
    if (mode === "edit" && stellplatzInfos) {
      setFormData((prev) => ({
        ...prev,
        kennzeichen: stellplatzInfos.kennzeichen ?? "",
        standort: stellplatzInfos.standort ?? "",
        besonderheit: stellplatzInfos.besonderheit ?? "",
        flugzeugtyp: stellplatzInfos.flugzeugtyp,
        flugzeuggroesse: stellplatzInfos.flugzeugsgrösse,
        services: Object.fromEntries(
          Object.entries(stellplatzInfos.services).map(([k, v]) => [
            k,
            v.enabled,
          ])
        ),
      }));
    }
  }, [mode, stellplatzInfos]);

  /* ------------------ HANDLERS ------------------ */

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      bild: e.target.files?.[0] ?? null,
    }));
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceName]: !prev.services[serviceName],
      },
    }));
  };

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const fd = new FormData();

    // Champs communs
    fd.append("kennzeichen", formData.kennzeichen);
    fd.append("standort", formData.standort);
    fd.append("besonderheit", formData.besonderheit);
    fd.append("flugzeugtyp", formData.flugzeugtyp);
    fd.append("flugzeuggroesse", formData.flugzeuggroesse);

    // Image uniquement si présente
    if (formData.bild) {
      fd.append("bild", formData.bild);
    }

    // Services sélectionnés
    Object.entries(formData.services)
      .filter(([_, enabled]) => enabled)
      .forEach(([service]) => {
        fd.append("services", service);
      });

    // Mode EDIT → envoyer l'id
    if (mode === "edit" && stellplatzInfos?.id) {
      fd.append("id", stellplatzInfos.id.toString());
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      mode === "create"
        ? "http://localhost:8888/api/stellplaetze"
        : `http://localhost:8888/api/stellplaetze/${stellplatzInfos?.id}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      }
    );

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Speichern fehlgeschlagen");
    }

    router.push("/dashboard");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  /* ------------------ JSX ------------------ */
  if (!hAnbieterInfos) {
   return <Loader />;
  }

  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-2xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
          <form onSubmit={handleSubmit}>
            {/*<h3 className="text-base text-midnight_text font-semibold mb-4">Persönliche Daten</h3>*/}
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Kennzeichen"
                name="kennzeichen"
                value={formData.kennzeichen}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="standort"
                name="standort"
                value={formData.standort}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <textarea
                placeholder="Besonderheiten zum Stellplatz (z.B. Stromanschluss, Nähe zum Hangartor, max. Spannweite...)"
                name="besonderheit"
                value={formData.besonderheit}
                rows={5}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="file"
                placeholder="bild"
                name="bild"
                onChange={handleFileChange}
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            

            <div className="mb-8">
              <h3 className="text-base text-midnight_text font-semibold mb-3 text-midnight_text dark:text-white">
                Kategorie
              </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Flugzeugtyp */}
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <select
        name="flugzeugtyp"
        className="w-full mb-2 rounded-md border px-3 py-2"
        value={formData.flugzeugtyp}
        onChange={handleInputChange}
      >
        <option value="">Flugzeugtyp auswählen</option>
                {hAnbieterInfos.flugzeugtyp.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
      </select>
    </div>

    {/* Flugzeuggröße */}
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <select
        className="w-full mb-2 rounded-md border px-3 py-2"
        name="flugzeuggroesse"
        value={formData.flugzeuggroesse}
        onChange={handleInputChange}
      >
        <option value="">Flugzeuggröße auswählen</option>
                {hAnbieterInfos.flugzeugsgrösse.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
      </select>
      {formData.flugzeuggroesse && (
        <>
        <p></p>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{flugzeugGroessenConfig[formData.flugzeuggroesse as keyof typeof flugzeugGroessenConfig]}</p>
        </>
      )}
    </div>

  </div>
            </div>
{/* Sektion Service */}
            <div className="mb-8">
  <h3 className="text-base font-semibold mb-4 text-midnight_text dark:text-white">
    Services am Stellplatz
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {Object.entries(hAnbieterInfos.services).map(
                  ([name, info]) => (
                    <label
                      key={name}
                      className="flex items-center gap-3 border p-3 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.services[name]}
                        onChange={() => handleServiceToggle(name)}
                      />
                      <span className="font-medium capitalize">{name}</span>
                      <span className="text-sm text-gray-500 ml-auto">
                        {info.price} € / {info.unit}
                      </span>
                    </label>
                  )
                )}

  </div>
</div>
            <div className="mb-9">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary hover:bg-DarkPrimary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:!bg-darkprimary dark:hover:!bg-darkprimary"
              >
                {mode === "create" ? "Stellplatz erstellen" : "Änderungen speichern"}
        {loading && <Loader />}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default StellplatzForm;