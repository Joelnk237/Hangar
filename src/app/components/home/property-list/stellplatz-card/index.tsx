import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../../style/index.css";
import { Eye, Edit, Trash2 } from "lucide-react";
import { stellplatzData } from "@/app/types/property/stellplatzData";

interface PropertyCardProps {
  property: stellplatzData;
  viewMode?: string;
}

const StellplatzCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {  
  
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
              src={property?.image}
              alt={`Image of ${property.image}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary items-center">
            verfügbar ab: {property.verfügbarkeit} {/* METTRE LE TAG */}
          </p>
        </div>
        <div className={`p-5 sm:p-8 dark:text-white text-opacity-50 ${viewMode=="list" && 'w-[70%] flex flex-col justify-center'}`}>

          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            
            <div>
              <p className="text-base text-gray">
                {property.hangaranbieter}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-lg group-hover:text-primary text-midnight_text dark:text-white">
                {property.flugzeugtyp} - {property.flugzeuggroesse}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {property.ort}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            <p>
                Services: {property.services}
            </p>
            
            <button
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title="Details ansehen"
          >
            <Eye size={22} />
          </button>
           
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StellplatzCard;
