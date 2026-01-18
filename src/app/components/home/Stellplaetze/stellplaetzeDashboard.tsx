'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import Image from 'next/image';
import { PropertyContext } from '@/context-api/PropertyContext';
import PropertyCard from '../property-list/property-card';
import StellplatzCard from '../actors/StellplatzCard';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stellplatz } from "@/app/types/property/stellplatz";
import { Loader } from 'lucide-react';

export default function stellplaetzeDashboard({ category }: { category?: string }) {
    const [stellplaetze, setStellplaetze] = useState<Stellplatz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { properties, updateFilter, filters } = useContext(PropertyContext)!;
    const [sortOrder, setSortOrder] = useState("none");
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [searchData, setSearchData] = useState<any>([]);

    



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

    useEffect(() => {
  const fetchStellplaetze = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // ou ton auth store

      const res = await fetch("http://localhost:8888/api/stellplaetze", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des stellplaetze");
      }

      const data: Stellplatz[] = await res.json();
      setStellplaetze(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStellplaetze();
}, []);


    


   const normalize = (str: string) =>
        str.toLowerCase().replace(/s$/, '');

    const filteredProperties = category
        ? properties.filter((data: any) =>
            normalize(data.category) === normalize(category)
        )
        : properties;

    // Sort logic
    const sortedProperties = [...filteredProperties].sort((a, b) => {
        const titleA = a.property_title?.toLowerCase() || "";
        const titleB = b.property_title?.toLowerCase() || "";

        if (sortOrder === "asc") {
            return titleA.localeCompare(titleB);
        } else if (sortOrder === "desc") {
            return titleB.localeCompare(titleA);
        }
        return 0; // no sort
    });

    const filteredCount = sortedProperties.length;
    const router = useRouter();

    if (loading) {
        return <Loader/>
    }

    return (
        <>
            
      <div className="pt-11 flex justify-center items-center">
        <div className="max-w-6xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
            <section className='dark:bg-darkmode px-4'>
                <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
                    

                    <div className='lg:grid lg:grid-cols-12 gap-4'>
                        
                        {/* PRENDS A PARTIR D'ICI !!!!*/}
                        <div className='col-span-12 lg:col-span-12'>
                            <div className="flex lg:flex-nowrap flex-wrap lg:gap-0 gap-6 w-full justify-between items-center pb-8">
                                <div className="flex w-full justify-between px-4 flex-1">
                                    <h5 className='text-xl '>{stellplaetze.length} Place Found</h5>
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
                                    <button onClick={() => router.push("/stellplaetze/stellplaetzeDashboard/new")} className={`${viewMode == "grid" ? 'bg-primary text-white' : 'bg-transparent text-primary'} p-3 border border-primary text-primary hover:text-white rounded-lg hover:bg-primary text-base`}>
                                        <span>Neuer Stellplatz</span>
                                    </button>
                                </div>
                            </div>
                            {filteredProperties.length > 0 ?
                                <div className={` ${viewMode === 'grid' ? 'grid sm:grid-cols-2' : 'flex flex-col'} gap-6 px-4`}>
                                    {/*{(sortOrder ? sortedProperties : properties).map((data: any, index: any) => (
                                        <PropertyCard key={index} property={data} viewMode={viewMode} />
                                    ))}*/}
                                   {stellplaetze.map((stellplatz) => (
                                        <StellplatzCard
                                            key={stellplatz.id}
                                            stellplatz={stellplatz}
                                            viewMode={viewMode}
                                            showActions={true}
                                        />
                                    ))}

                                </div>
                                :
                                <div className='flex flex-col gap-5 items-center justify-center pt-20'>
                                    <Image src={"/images/not-found/no-results.png"} alt='no-result' width={100} height={100} />
                                    <p className='text-gray'>Keine Stellplätze vorhanden</p>
                                </div>
                            }
                        </div>
                        {/* FIN ICI !!!! */}
                    </div>
                </div>
            </section></div></div>
        </>
    );
}