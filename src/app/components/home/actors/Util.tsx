'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import Image from 'next/image';
import HeroSub from '../../shared/hero-sub';
import { PropertyContext } from '@/context-api/PropertyContext';
import PropertyCard from '../../home/property-list/property-card';
import StellplatzCard from './StellplatzCard';

export default function AdvanceSearch({ category }: { category?: string }) {
    const [price, setPrice] = useState(50);
    const [price1, setPrice1] = useState(50);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { properties, updateFilter, filters } = useContext(PropertyContext)!;
    const [sortOrder, setSortOrder] = useState("none");
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [searchData, setSearchData] = useState<any>([]);

    const stellplaetze = [
    {
        id: "SP-001",
        status: "frei",
        image: "/images/properties/stellplatz1.jpg",
        flugzeugtyp: "Cessna 172",
        abmessung: {
        spannweite: 11,
        laenge: 8,
        hoehe: 3,
        },
        wetterschutz: true,
        flugfeld: true,
        zugang24h: true,
        wachschutz: true,
        einlagerung: {
        preis: 45,
        einheit: "pro Tag",
        },
        ort: "EDDF – Frankfurt",
    },

    {
        id: "SP-002",
        status: "besetzt",
        image: "/images/properties/stellplatz2.jpg",
        flugzeugtyp: "Piper PA-28",
        abmessung: {
        spannweite: 11,
        laenge: 7.5,
        hoehe: 3,
        },
        wetterschutz: true,
        flugfeld: false,
        zugang24h: false,
        wachschutz: true,
        einlagerung: {
        preis: 1200,
        einheit: "pro Monat",
        },
        ort: "EDDM – München",
    },

    {
        id: "SP-003",
        status: "frei",
        image: "/images/properties/stellplatz3.jpg",
        flugzeugtyp: "Beechcraft Bonanza",
        abmessung: {
        spannweite: 10.2,
        laenge: 8.3,
        hoehe: 2.6,
        },
        wetterschutz: true,
        flugfeld: true,
        zugang24h: true,
        wachschutz: false,
        einlagerung: {
        preis: 60,
        einheit: "pro Tag",
        },
        ort: "EDDH – Hamburg",
    },

    {
        id: "SP-004",
        status: "reserviert",
        image: "/images/properties/stellplatz4.jpg",
        flugzeugtyp: "Diamond DA40",
        abmessung: {
        spannweite: 11.9,
        laenge: 8.1,
        hoehe: 2.4,
        },
        wetterschutz: false,
        flugfeld: true,
        zugang24h: false,
        wachschutz: false,
        einlagerung: {
        preis: 950,
        einheit: "pro Monat",
        },
        ort: "EDDS – Stuttgart",
    },
    ];



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

    return (
        <>
            
            <section className='dark:bg-darkmode px-4'>
                <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
                    

                    <div className='lg:grid lg:grid-cols-12 gap-4'>
                        
                        {/* PRENDS A PARTIR D'ICI !!!!*/}
                        <div className='col-span-12 lg:col-span-12'>
                            <div className="flex lg:flex-nowrap flex-wrap lg:gap-0 gap-6 w-full justify-between items-center pb-8">
                                <div className="flex w-full justify-between px-4 flex-1">
                                    <h5 className='text-xl '>{filteredCount} Properties Found</h5>
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
                            {filteredProperties.length > 0 ?
                                <div className={` ${viewMode === 'grid' ? 'grid sm:grid-cols-2' : 'flex flex-col'} gap-6 px-4`}>
                                    {/*{(sortOrder ? sortedProperties : properties).map((data: any, index: any) => (
                                        <PropertyCard key={index} property={data} viewMode={viewMode} />
                                    ))}*/}
                                    {stellplaetze.map((data: any, index: any) => (
                                        <StellplatzCard key={index} stellplatz={data} viewMode={viewMode} />
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
            </section>
        </>
    );
}