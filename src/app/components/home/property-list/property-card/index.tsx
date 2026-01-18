import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../../style/index.css";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Flugzeug } from "@/app/types/property/flugzeug";

interface PropertyCardProps {
  property: Flugzeug;
  viewMode?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {
  
  
  const handleDelete = async (e: React.MouseEvent) => {
  e.preventDefault();

  if (property.status) {
    alert("Dieses Flugzeug ist aktuell einem Stellplatz zugeordnet und kann nicht gelöscht werden.");
    return;
  }

  const confirmed = confirm(
    "Möchten Sie dieses Flugzeug wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden."
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8888/api/flugzeuge/${property.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Löschen fehlgeschlagen");
    }

    alert("Flugzeug erfolgreich gelöscht");

    //  reload
    window.location.reload();

  } catch (err: any) {
    alert(err.message || "Fehler beim Löschen");
  }
};

  
  return (
    <div
      key={property.id}
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden`}
      data-aos="fade-up"
    >
      <Link href={``} className={`group ${viewMode=="list" && 'flex' }`}>
        <div className={`relative ${viewMode=="list" && 'w-[30%]'}`}>
          <div className={`imageContainer h-[250px] w-full ${viewMode =="list" && 'h-full md:h-52'}`}>
            <Image
              src={property.bild
          ? `http://localhost:8888${property.bild}`
          : "/images/properties/stellplatz-placeholder.jpg"}
              alt={`Image of ${property.kennzeichen}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary items-center">
            {property.status ? `belegt`: `noch nicht belegt`} {/* METTRE LE TAG */}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[10px] right-[10px] bg-white p-2 rounded-lg"
            viewBox="0 0 24 24"
            width="38"
            height="38"
            fill="#2F73F2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className={`p-5 sm:p-8 dark:text-white text-opacity-50 ${viewMode=="list" && 'w-[70%] flex flex-col justify-center'}`}>

          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            
            <div>
              <p className="text-base text-gray">
                {property.flugzeugtyp}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl group-hover:text-primary text-midnight_text dark:text-white">
                {property.kennzeichen}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {property.flugzeuggroesse}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            
              <button
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="Details ansehen"
          >
            <Eye size={22} />
          </button>

          <button
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="bearbeiten"
          >
            <Edit size={22} />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="löschen"
          >
            <Trash2 size={22} />
          </button>
           
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
