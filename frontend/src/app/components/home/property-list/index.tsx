"use client";
import { useEffect, useState } from 'react';
import PropertyCard from './property-card';
import Image from 'next/image';
import { Flugzeug } from "@/app/types/property/flugzeug";

const Listing = () => {


    const [properties, setProperties] = useState<any[]>([])
    const [flugzeuge, setFlugzeuge] = useState<Flugzeug[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchFlugzeuge = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Nicht authentifiziert");
    
          const res = await fetch("http://localhost:8888/api/flugzeuge", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!res.ok) {
            throw new Error("Fehler beim Laden der Flugzeuge");
          }
    
          const data = await res.json();
          setFlugzeuge(data);
        } catch (err: any) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      fetchFlugzeuge();
    }, []);


    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/propertydata')
        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()
        setProperties(data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchData()
  }, [])
    return (
        <section className="bg-light dark:bg-semidark flex justify-center items-center">
            <div className="lg:max-w-screen-xl md:max-w-screen-md mx-auto container px-4">
                <h1 className="text-4xl font-bold mb-12 text-midnight_text dark:text-white" data-aos="fade-up">Meine Flugzeuge</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {flugzeuge.length > 0 ? 
                    flugzeuge.slice(0, 6).map((property, index) => (
                        <div key={property.id} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                            <PropertyCard property={property} />
                        </div>
                    )) 
                    : 
                      <div className='flex flex-col gap-5 items-center justify-center pt-20'>
                        <Image src={"/images/not-found/no-results.png"} alt='no-result' width={100} height={100} />
                        <p className='text-gray'>Noch keine Flugzeuge vorhanden</p>
                      </div>
                    }
                </div>
            </div>
        </section>
    );
};

export default Listing;