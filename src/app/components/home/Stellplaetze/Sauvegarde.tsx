import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../../style/index.css";
import { propertyData } from "@/app/types/property/propertyData";

interface PropertyCardProps {
  property: propertyData;
  viewMode?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {  
  
  return (
    <div
      key={property.id}
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden`}
      data-aos="fade-up"
    >
      <Link href={`/properties/properties-list/${property.slug}`} className={`group ${viewMode=="list" && 'flex' }`}>
        <div className={`relative ${viewMode=="list" && 'w-[30%]'}`}>
          <div className={`imageContainer h-[250px] w-full ${viewMode =="list" && 'h-full md:h-52'}`}>
            <Image
              src={property?.property_img}
              alt={`Image of ${property.property_title}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary items-center">
            {property.tag} {/* METTRE LE TAG */}
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
                {property.property_title}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl group-hover:text-primary text-midnight_text dark:text-white">
                {property.property_price}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {property.location}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "auto", height: "auto" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-horizontal-icon lucide-move-horizontal"><path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/></svg>
                {property.beds}
              </p>
              <p className="text-sm text-gray">
                Spannweite
              </p>
            </div>
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "auto", height: "auto" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-vertical-icon lucide-move-vertical"><path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/></svg>
                {property.bathrooms}
              </p>
              <p className="text-sm text-gray">
                Länge
              </p>
            </div>
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "auto", height: "auto" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-triangle-right-icon lucide-triangle-right"><path d="M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z"/></svg>
                {property.livingArea}
              </p>
              <p className="text-sm text-gray">
                Höhe
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
