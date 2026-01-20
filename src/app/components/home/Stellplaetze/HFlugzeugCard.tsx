import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../style/index.css";
import { Eye} from "lucide-react";
import { flugzeugData } from "@/app/types/property/propertyData";

interface PropertyCardProps {
  property: flugzeugData;
  viewMode?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {  
  
  return (
    <div
      key={property.flugzeug.id}
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden`}
      data-aos="fade-up"
    >
      <Link href={``} className={`group ${viewMode=="list" && 'flex' }`}>
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
      </Link>
    </div>
  );
};

export default PropertyCard;
