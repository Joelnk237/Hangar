"use client";
import Link from "next/link";
import SocialSignUp from "../social-button/SocialSignUp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../shared/Loader";
import Logo from "../../layout/header/logo";
import ServiceCard from "../ServiceCard";
import AircraftTypesAndSlots from "../AircraftTypesAndSlots";
const SignUp = () => {
  const router = useRouter();

type FlugzeugTypEintrag = {
  typ: "SEP" | "MEP" | "Helikopter" | "Jet" | "Turboprop" | "Ultraleicht";
  stellplaetze: number;
};

type FlugzeugGroesseEintrag = {
  groesse: "XS" | "S" | "M" | "L" | "XL";
  stellplaetze: number;
};

const [flugzeugtypen, setFlugzeugtypen] = useState<FlugzeugTypEintrag[]>([]);
const [flugzeuggroessen, setFlugzeuggroessen] = useState<FlugzeugGroesseEintrag[]>([]);


  type HangarMerkmale = {
  wetterschutz: {
    enabled: boolean;
    voll: boolean;
    teil: boolean;
  };
  flugfeld: {
    enabled: boolean;
    asphalt: boolean;
    gras: boolean;
  };
  zugang24h: {
    enabled: boolean;
    code: boolean;
    chip: boolean;
  };
  wachschutz: {
    enabled: boolean;
    alarm: boolean;
    zutritt: boolean;
  };
  video: {
    enabled: boolean;
    live: boolean;
    recording24h: boolean;
  };
};

const initialHangarMerkmale: HangarMerkmale = {
  wetterschutz: {
    enabled: false,
    voll: false,
    teil: false,
  },
  flugfeld: {
    enabled: false,
    asphalt: false,
    gras: false,
  },
  zugang24h: {
    enabled: false,
    code: false,
    chip: false,
  },
  wachschutz: {
    enabled: false,
    alarm: false,
    zutritt: false,
  },
  video: {
    enabled: false,
    live: false,
    recording24h: false,
  },
};


  //Services TYpen : Datenstruktrur
  const initialServices = {
  einlagerung: {
    enabled: false,
    price: "",
    unit: "pro Tag",
  },
  flugbereitschaft: {
    enabled: false,
    price: "",
    unit: "pro Vorgang",
  },
  tanken: {
    enabled: false,
    price: "",
    unit: "pro Liter",
  },
  reinigung: {
    enabled: false,
    price: "",
    unit: "komplett",
  },
} as const;

type ServiceKey = keyof typeof initialServices;

type AircraftSlots = {
  aircraftTypes: string[];
  slotsPerType: Record<string, number>;
};

  const [loading, setLoading] = useState(false);
  type FormData = {
  firmenname: string;
  ansPartner: string;
  email: string;
  tel: string;
  password: string;
  strasse: string;
  hNr: string;
  plz: string;
  ort: string;
  hangarMerkmale: HangarMerkmale;
  services: typeof initialServices;
  flugzeugtypUndStellplaetze: AircraftSlots;
};

  const [formData, setFormData] = useState<FormData>({
    firmenname: "",
    ansPartner: "",
    email: "",
    tel: "",
    password: "",
    strasse: "",
    hNr: "",
    plz: "",
    ort: "",
    hangarMerkmale: structuredClone(initialHangarMerkmale),

  services: structuredClone(initialServices),

  flugzeugtypUndStellplaetze: {
      aircraftTypes: [],
      slotsPerType: {},
    },
  });

  //state für Error Handling
  const [serviceErrors, setServiceErrors] = useState<Record<string, string>>({});

  // schon definierte Flugzeugtypen
  const availableAircraftTypes = ["Cessna 172", "Piper PA-28", "Beechcraft Bonanza"];
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (!/^[a-zA-Z\s]{3,}$/.test(name)) return "Name must be at least 3 characters and contain only letters";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Validate Service
  const validateServices = (): Partial<Record<ServiceKey, string>> => {
  const errors: Partial<Record<ServiceKey, string>> = {};

  (Object.keys(formData.services) as ServiceKey[]).forEach((key) => {
    const service = formData.services[key];
    if (service.enabled && (!service.price || Number(service.price) <= 0)) {
      errors[key] = "Bitte einen gültigen Preis angeben";
    }
  });

  return errors;
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    setErrors((prev) => ({
      ...prev,
      [name]: name === "firmenname"
        ? validateName(value)
        : name === "email"
          ? validateEmail(value)
          : validatePassword(value),
    }));
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



//Manage Services
const handleServiceToggle = (service: ServiceKey) => {
  setFormData(prev => ({
    ...prev,
    services: {
      ...prev.services,
      [service]: {
        ...prev.services[service],
        enabled: !prev.services[service].enabled,
      },
    },
  }));
};

const handleServicePrice = (service: ServiceKey, value: string) => {
  setFormData(prev => ({
    ...prev,
    services: {
      ...prev.services,
      [service]: {
        ...prev.services[service],
        price: value,
      },
    },
  }));
};

const handleServiceUnit = (service: ServiceKey, value: string) => {
  setFormData(prev => ({
    ...prev,
    services: {
      ...prev.services,
      [service]: {
        ...prev.services[service],
        unit: value,
      },
    },
  }));
};


// Manage submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submitting
    setLoading(true);
    try {

      //Bereite das JSON für das Backend vor
    const payload = {
      rolle: "hangaranbieter",
      name: formData.firmenname,
      ansPartner: formData.ansPartner,
      email: formData.email,
      tel: formData.tel,
      password: formData.password,
      adresse: {
        strasse: formData.strasse,
        hausnummer: formData.hNr,
        plz: formData.plz,
        ort: formData.ort
      },
      hangarMerkmale: formData.hangarMerkmale,
      services: formData.services,
      flugzeugtypen,
      flugzeuggroessen,

    };

    //POST-Request zum Vert.x Backend
    const res = await fetch("http://localhost:8888/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Registration failed");
    }

    const data = await res.json();
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      //localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (error: any) {
      console.error("Registration Error:", error);
    alert(error.message || "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
          <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
            <Logo />
          </div>


          

          <form onSubmit={handleSubmit}>
            {/*<h3 className="text-base text-midnight_text font-semibold mb-4">Persönliche Daten</h3>*/}
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
                name="ansPartner"
                value={formData.ansPartner}
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
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
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
                name="hNr"
                value={formData.hNr}
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

            <div className="mb-8">
              <h3 className="text-base text-midnight_text font-semibold mb-3 text-midnight_text dark:text-white">
                Hangar-Merkmale
              </h3>
 {/* Sektion Hangar-Merkmale */}
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
{/* Sektion Service */}
            <div className="mb-8">
  <h3 className="text-base font-semibold mb-4 text-midnight_text dark:text-white">
    Services am Standort
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <ServiceCard
      title="Einlagerungsservice"
      enabled={formData.services.einlagerung.enabled}
      price={formData.services.einlagerung.price}
      unit={formData.services.einlagerung.unit}
      unitOptions={["pro Tag", "pro Woche", "pro Monat"]}
      onToggle={() => handleServiceToggle("einlagerung")}
      onPriceChange={(v) => handleServicePrice("einlagerung", v)}
      onUnitChange={(v) => handleServiceUnit("einlagerung", v)}
      error={serviceErrors.einlagerung}
    />

    <ServiceCard
      title="Flugbereitschaft herstellen"
      enabled={formData.services.flugbereitschaft.enabled}
      price={formData.services.flugbereitschaft.price}
      unit={formData.services.flugbereitschaft.unit}
      unitOptions={["pro Vorgang", "pauschal"]}
      onToggle={() => handleServiceToggle("flugbereitschaft")}
      onPriceChange={(v) => handleServicePrice("flugbereitschaft", v)}
      onUnitChange={(v) => handleServiceUnit("flugbereitschaft", v)}
      error={serviceErrors.flugbereit}
    />

    <ServiceCard
      title="Tanken"
      enabled={formData.services.tanken.enabled}
      price={formData.services.tanken.price}
      unit={formData.services.tanken.unit}
      unitOptions={["pro Liter", "pauschal"]}
      onToggle={() => handleServiceToggle("tanken")}
      onPriceChange={(v) => handleServicePrice("tanken", v)}
      onUnitChange={(v) => handleServiceUnit("tanken", v)}
      error={serviceErrors.tanken}
    />

    <ServiceCard
      title="Reinigung"
      enabled={formData.services.reinigung.enabled}
      price={formData.services.reinigung.price}
      unit={formData.services.reinigung.unit}
      unitOptions={["innen", "außen", "komplett"]}
      onToggle={() => handleServiceToggle("reinigung")}
      onPriceChange={(v) => handleServicePrice("reinigung", v)}
      onUnitChange={(v) => handleServiceUnit("reinigung", v)}
      error={serviceErrors.reinigung}
    />

  </div>
</div>

{/* Sektion Flugzeugtyp und Stellplätze */}
 <AircraftTypesAndSlots
    value={{ flugzeugtypen, flugzeuggroessen }}
    onChange={({ flugzeugtypen: ft, flugzeuggroessen: fg }) => {
      setFlugzeugtypen(ft);
      setFlugzeuggroessen(fg);
    }}
  />



            <div className="mb-9">
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center rounded-md bg-primary hover:bg-DarkPrimary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:!bg-darkprimary dark:hover:!bg-darkprimary"
              >
                Sign Up {loading && <Loader />}
              </button>
            </div>
          </form>

          {/*<p className="text-midnight_text dark:text-white mb-4 text-base">
            By creating an account you are agree with our{" "}
            <a href="/#" className="text-midnight_text dark:text-white hover:text-primary dark:hover:text-primary">
              Privacy
            </a>{" "}
            and{" "}
            <a href="/#" className="text-midnight_text dark:text-white hover:text-primary dark:hover:text-primary">
              Policy
            </a>
          </p>*/}

          <p className="text-midnight_text dark:text-white text-base">
            Already have an account?
            <Link
              href="/signin"
              className="pl-2 text-midnight_text dark:text-white hover:text-primary dark:hover:text-primary"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
