import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../style/index.css";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Stellplatz } from "@/app/types/property/stellplatz";

interface StellplatzCardProps {
  stellplatz: Stellplatz;
  viewMode?: string;
  showActions?: boolean;
}

const StellplatzCard: React.FC<StellplatzCardProps> = ({ stellplatz, viewMode, showActions }) => { 
  const serviceLabels = stellplatz.services
  ?.map(service => service.bezeichnung)
  .join(", "); 
  
  return (
    <div
      key={stellplatz.id}
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden`}
      data-aos="fade-up"
    >
      <Link href={`/properties/properties-list/`} className={`group ${viewMode=="list" && 'flex' }`}>
        <div className={`relative ${viewMode=="list" && 'w-[30%]'}`}>
          <div className={`imageContainer h-[250px] w-full ${viewMode =="list" && 'h-full md:h-52'}`}>
            <Image
              src={stellplatz.bild
      ? `http://localhost:8888${stellplatz.bild}`
      : "/images/properties/stellplatz-placeholder.jpg"}
              alt={`Image of place ${stellplatz.id}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary items-center">
            {stellplatz.availability ? `frei`: `besetzt`} {/* METTRE LE TAG */}
          </p>
          {/*<svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[10px] right-[10px] bg-white p-2 rounded-lg"
            viewBox="0 0 24 24"
            width="38"
            height="38"
            fill="#2F73F2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#2F73F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole-open-icon lucide-lock-keyhole-open absolute top-[10px] right-[10px] bg-white p-2 rounded-lg"><circle cx="12" cy="16" r="1"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 9.33-2.5"/></svg>

        </div>
        <div className={`p-5 sm:p-8 dark:text-white text-opacity-50 ${viewMode=="list" && 'w-[70%] flex flex-col justify-center'}`}>

          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            
            <div>
              <p className="text-base text-gray">
                {stellplatz.flugzeugtyp}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl group-hover:text-primary text-midnight_text dark:text-white">
                {stellplatz.kennzeichen}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {stellplatz.standort}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            <div className="flex flex-row">
              {stellplatz.services && stellplatz.services.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <span className="font-semibold text-midnight_text dark:text-white">
                    Services:
                  </span>{" "}
                  {serviceLabels}
                </p>
              )}
            </div>
            {/*<div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-rain-wind-icon lucide-cloud-rain-wind"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m9.2 22 3-7"/><path d="m9 13-3 7"/><path d="m17 13-3 7"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-icon lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-door-open-icon lucide-door-open"><path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/></svg>
              </p>
            </div>*/}
            {/*<div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                {stellplatz.einlagerung.preis} €
              </p>
              <p className="text-sm text-gray">
                {stellplatz.einlagerung.einheit}
              </p>
            </div>* */}
            {showActions && (
        <div className="flex justify-end gap-3 px-5 pb-4">
          <button
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="ansehen"
          >
            <Eye size={18} />
          </button>

          <button
            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
            title="bearbeiten"
          >
            <Edit size={18} />
          </button>

          <button
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition"
            title="löschen"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StellplatzCard;
