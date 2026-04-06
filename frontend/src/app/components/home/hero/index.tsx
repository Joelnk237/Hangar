"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from 'react';
import { PropertyContext } from "@/context-api/PropertyContext";

const Hero = () => {
  const router = useRouter();
  const { properties, updateFilter } = useContext(PropertyContext)!;
  const [location, setLocation] = useState("");
  const [error, setError] = useState('');


  const handleSearchSell = () => {
    if (location.trim() === '') {
      setError('Please enter a location to search.');
      return;
    }
    setError('');
    updateFilter('location', location);
    //updateFilter('tag', 'sell');
    router.push(`/properties/properties-list/${encodeURIComponent(location)}`);
  };


  

  return (
    <section className="relative pt-48 pb-14 dark:bg-darklight bg-no-repeat bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
        <div className="grid lg:grid-cols-12 grid-cols-1">
          <div
            className="flex flex-col col-span-6 justify-center items-start"
            data-aos="fade-right"
          >
            <div className="mb-8">
              <h1 className="md:text-[50px] leading-[1.2] text-4xl  ml-4 text-midnight_text dark:text-white font-bold">
                Finde das beste Hangar für dein Flugzeug
              </h1>
            </div>
            <div className="max-w-xl ml-4 sm:w-full">
              <div className="bg-white dark:bg-transparent rounded-b-lg rounded-tr-lg">
                  <div className="bg-white dark:bg-darkmode rounded-b-lg rounded-tr-lg shadow-lg p-8 pb-10">
                    <div className="relative rounded-lg border-0 my-2">
                      <div className="relative flex items-center">
                        <div className="absolute left-0 p-4">
                          <Image
                            src="/images/svgs/icon-location.svg"
                            alt="Icon"
                            height={24}
                            width={24}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Search Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="py-5 pr-3 pl-14 w-full rounded-lg text-black border border-border dark:text-white dark:border-dark_border focus:border-primary dark:focus:border-primary focus-visible:outline-none dark:bg-[#0c121e]"
                        />

              

                      </div>
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-4 md:justify-between">
                      <div className="flex flex-col md:flex-row md:gap-4 w-full">
                        <button onClick={handleSearchSell} className="flex-1 py-2 md:py-4 text-lg md:text-xl px-4 md:px-8 bg-primary text-white rounded-lg hover:bg-blue-700 transition duration-300 mb-2 md:mb-0 md:mr-2">
                          Search
                        </button>
                        <button onClick={handleSearchSell} className="flex-1 py-2 md:py-4 text-lg md:text-xl px-4 md:px-8 bg-skyBlue/80 dark:bg-skyBlue/80 dark:hover:bg-skyBlue dark:hover:border-primary border border-transparent text-white rounded-lg hover:bg-skyBlue transition duration-300 text-nowrap">
                          Advance Search
                        </button>
                      </div>
                      {error && (
                        <p className="text-red-600 text-sm mt-2 md:mt-0">{error}</p>
                      )}
                    </div>
                  </div>
              </div>
            </div>
            <div className="flex flex-col justify-start ml-4 mt-8 mb-12 gap-3">
              <div className="flex space-x-2" data-aos="fade-left">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="lg:block hidden col-span-6 absolute xl:-right-60 right-0 bottom-0 -z-1">
            <Image
              src="/images/hero/hero-image.png"
              alt="heroimage"
              width={800}
              height={0}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
