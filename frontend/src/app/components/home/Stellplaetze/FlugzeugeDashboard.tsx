'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import Image from 'next/image';
import { PropertyContext } from '@/context-api/PropertyContext';
import FlugzeugCard from './HFlugzeugCard';
import { flugzeugData } from "@/app/types/property/propertyData";
import Loader from '../../shared/Loader';

export default function FlugzeugDashboard({ category }: { category?: string }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { properties, updateFilter, filters } = useContext(PropertyContext)!;
    const [sortOrder, setSortOrder] = useState("none");
    const [flugzeuge, setFlugzeuge] = useState<flugzeugData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEmptyModal, setShowEmptyModal] = useState(false);

    useEffect(() => {
  const fetchFlugzeuge = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8888/api/hangaranbieter/stellplaetze/manage",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Fehler beim Laden der Flugzeuge");
      }

      const data: flugzeugData[] = await res.json();

      if (data.length === 0) {
        setShowEmptyModal(true);
      } else {
        setFlugzeuge(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchFlugzeuge();
}, []);






    





    if (loading) {
        return (
            <Loader/>
        );
    }

    return (
        <>
        {showEmptyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-semidark rounded-lg p-6 max-w-md text-center">
      <h3 className="text-lg font-semibold mb-3">
        Keine belegten Stellplätze
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Aktuell sind keine Flugzeuge vorhanden, die Ihre Stellplätze belegen.
      </p>
      <button
        onClick={() => setShowEmptyModal(false)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Verstanden
      </button>
    </div>
  </div>
)}

            <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
       
            <section className='dark:bg-darkmode px-4'>
                <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
                    

                    <div className='lg:grid lg:grid-cols-12 gap-4'>
                        
                        {/* PRENDS A PARTIR D'ICI !!!!*/}
                        <div className='col-span-12 lg:col-span-12'>
                            <div className="flex lg:flex-nowrap flex-wrap lg:gap-0 gap-6 w-full justify-between items-center pb-8">
                                <div className="flex w-full justify-between px-4 flex-1">
                                    <h5 className='text-xl '>{flugzeuge.length} Flugzeuge gefunden</h5>
                                    <p className='flex text-gray dark:text-gray gap-2 items-center'>
                                        Sort by
                                        <span>
                                            <Icon
                                                icon="fa6-solid:arrow-trend-up"
                                                width="20"
                                                height="20"
                                                className=""
                                            />
                                        </span>
                                    </p>
                                </div>
                                <div className="flex-1 flex gap-3 px-4">
                                    <select
                                        name="short"
                                        className="custom-select border border-border dark:border-dark_border dark:bg-darkmode text-midnight_text focus:border-primary rounded-lg p-3 pr-9"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="none">Sort by Title</option>
                                        <option value="asc">Title (A-Z)</option>
                                        <option value="desc">Title (Z-A)</option>
                                    </select>

                                    <button onClick={() => setViewMode('list')} className={`${viewMode == "list" ? 'bg-primary text-white' : 'bg-transparent text-primary'} p-3 border border-primary text-primary hover:text-white rounded-lg hover:bg-primary text-base`}>
                                        <span>
                                            <Icon
                                                icon="famicons:list"
                                                width="21"
                                                height="21"
                                                className=""
                                            />
                                        </span>
                                    </button>
                                    <button onClick={() => setViewMode('grid')} className={`${viewMode == "grid" ? 'bg-primary text-white' : 'bg-transparent text-primary'} p-3 border border-primary text-primary hover:text-white rounded-lg hover:bg-primary text-base`}>
                                        <span>
                                            <Icon
                                                icon="ion:grid-sharp"
                                                width="21"
                                                height="21"
                                                className=""
                                            />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {flugzeuge.length > 0 ?
                                <div className={` ${viewMode === 'grid' ? 'grid sm:grid-cols-2' : 'flex flex-col'} sm:grid-cols-2 lg:grid-cols-2 gap-4 px-4`}>
                                    {/*{(sortOrder ? sortedProperties : properties).map((data: any, index: any) => (
                                        <PropertyCard key={index} property={data} viewMode={viewMode} />
                                    ))}*/}
                                    {flugzeuge.map((data, index) => (
                                        <FlugzeugCard
                                            key={data.flugzeug.id}
                                            property={data}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>
                                :
                                <div className='flex flex-col gap-5 items-center justify-center pt-20'>
                                    <Image src={"/images/not-found/no-results.png"} alt='no-result' width={100} height={100} />
                                    <p className='text-gray'>Kein FLugzeug vorhanden</p>
                                </div>
                            }
                        </div>
                        {/* FIN ICI !!!! */}
                    </div>
                </div>
            </section>
            </div>
            </div>
        </>
    );
}