'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import Image from 'next/image';
import { PropertyContext } from '@/context-api/PropertyContext';
import FlugzeugCard from './HFlugzeugCard';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FlugzeugDashboard({ category }: { category?: string }) {
    const [price, setPrice] = useState(50);
    const [price1, setPrice1] = useState(50);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { properties, updateFilter, filters } = useContext(PropertyContext)!;
    const [sortOrder, setSortOrder] = useState("none");
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [searchData, setSearchData] = useState<any>([]);

    const Flugzeuge = [
        // Flugzeuge
        {
          id: '1',
          image: "/images/properties/airbus-1.jpg",
          flugzeugtyp: "Cessna",
          flugzeuggroesse: "XL",
          kennzeichen: "D-ABCD",
          stellplatz: "PLACE 256",
          rTermin: "2026-12-30",
        },
      {
    id: '2',
    image: "/images/properties/aircraft-2.jpg",
    flugzeugtyp: "Cessna",
    flugzeuggroesse: "XL",
    kennzeichen: "D-ABCD",
    stellplatz: "PLACE 256",
    rTermin: "2026-12-30",
  },
  {
    id: '3',
    image: "/images/properties/airbus-3.jpg",
    flugzeugtyp: "Cessna",
    flugzeuggroesse: "XL",
    kennzeichen: "D-ABCD",
    stellplatz: "PLACE 256",
    rTermin: "2026-12-30",
  },] ;



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/pagedata')
                if (!res.ok) throw new Error('Failed to fetch')

                const data = await res.json()
                setSearchData(data?.searchOptions || [])
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }

        fetchData()
    }, [])

    



    const router = useRouter();

    return (
        <>
            <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center text-center ">
       
            <section className='dark:bg-darkmode px-4'>
                <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
                    

                    <div className='lg:grid lg:grid-cols-12 gap-4'>
                        
                        {/* PRENDS A PARTIR D'ICI !!!!*/}
                        <div className='col-span-12 lg:col-span-12'>
                            <div className="flex lg:flex-nowrap flex-wrap lg:gap-0 gap-6 w-full justify-between items-center pb-8">
                                <div className="flex w-full justify-between px-4 flex-1">
                                    <h5 className='text-xl '>{Flugzeuge.length} Properties Found</h5>
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
                            {Flugzeuge.length > 0 ?
                                <div className={` ${viewMode === 'grid' ? 'grid sm:grid-cols-2' : 'flex flex-col'} sm:grid-cols-2 lg:grid-cols-2 gap-4 px-4`}>
                                    {/*{(sortOrder ? sortedProperties : properties).map((data: any, index: any) => (
                                        <PropertyCard key={index} property={data} viewMode={viewMode} />
                                    ))}*/}
                                    {Flugzeuge.map((data: any, index: any) => (
                                        <FlugzeugCard key={index} property={data} viewMode={viewMode} />
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