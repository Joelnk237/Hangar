import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../../style/index.css";
import { flugzeugData } from "@/app/types/property/propertyData";

interface PropertyCardProps {
  property: flugzeugData;
  viewMode?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {  

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [fahrbereitschaft, setFahrbereitschaft] = React.useState("");
  const [beschreibung, setBeschreibung] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router= useRouter();

  const openModal = () => {
  setIsModalOpen(true);
  };

const closeModal = () => {
  setIsModalOpen(false);
  setFahrbereitschaft("");
  setBeschreibung("");
};


const handleConfirm = async () => {
  if (!fahrbereitschaft.trim()) {
    return;
  }
try {
  setLoading(true);
  setError(null);

  const token = localStorage.getItem("token");
    // fetch POST →  backend
    const res = await fetch(
      "http://localhost:8888/api/zustand/fahrbereitschaft",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flugzeugId: property.flugzeug.id,
          stellplatzId: property.stellplatz.id,
          fahrbereitschaft,
          beschreibung,
        }),
      }
    );

    /* ===== ERROR HANDLING ===== */
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/signin");
      return;
    }

    if (res.status === 403) {
      throw new Error(
        "Sie haben keine Berechtigung, diese Aktion auszuführen."
      );
    }

    //Succes

    closeModal();
    setFahrbereitschaft("");
    setBeschreibung("");
  } catch (err: any) {
    setError(err.message ?? "Fehler");
  } finally {
    setLoading(false);
  }
};





  return (
    <>
    {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-semidark rounded-lg w-full max-w-lg p-6">
      
      <h3 className="text-lg font-semibold mb-6">
        Fahrbereitschaft einstellen
      </h3>

      {/* Fahrbereitschaft */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Fahrbereitschaft <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={fahrbereitschaft}
          onChange={(e) => setFahrbereitschaft(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Beschreibung */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Beschreibung
        </label>
        <textarea
          rows={4}
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Abbrechen */}
      <div className="flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Abbrechen
        </button>

        <button
          onClick={handleConfirm}
          disabled={!fahrbereitschaft.trim()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Bestätigen
        </button>
      </div>

    </div>
  </div>
)}
{error && (
  <div className="mb-4 rounded-md bg-red-100 text-red-700 px-3 py-2">
    {error}
  </div>
)}
    <div
      key={property.flugzeug.id}
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden`}
      data-aos="fade-up"
    >
      <div className={`group ${viewMode=="list" && 'flex' }`}>
        <div className={`relative ${viewMode=="list" && 'w-[30%]'}`}>
          <div className={`imageContainer h-[250px] w-full ${viewMode =="list" && 'h-full md:h-52'}`}>
            <Image
              src={property? `http://localhost:8888${property.flugzeug.bild}`
      : "/images/properties/stellplatz-placeholder.jpg"}
              alt={`Image of ${property.flugzeug.kennzeichen}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary items-center">
            von:{property.von} {/* TAG */}
          </p>
          <p className="absolute top-[10px] right-[10px] p-2 rounded-lg py-1 px-4 bg-white rounded-md text-primary items-center">
            bis:{property.bis} {/* TAG */}
          </p>
        </div>
        <div className={`p-5 sm:p-8 dark:text-white text-opacity-50 ${viewMode=="list" && 'w-[70%] flex flex-col justify-center'}`}>

          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            
            <div>
              <p className="text-base text-gray">
                {property.flugzeug.flugzeugtyp} - {property.flugzeug.flugzeuggroesse}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl group-hover:text-primary text-midnight_text dark:text-white">
                {property.flugzeug.kennzeichen}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {property.stellplatz.kennzeichen}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            
              

          <button
            onClick={(e) => {
              e.preventDefault();
              openModal();
            }}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Fahrbereitschaft einstellen
          </button>

          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Wartung verwalten
          </button>
           
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PropertyCard;
