"use client";
import { useEffect, useState } from 'react';
import PropertyCard from './property-card';
import Image from 'next/image';

const Listing = () => {

  const property = [
        // Flugzeuge
        {
          id: '1',
          property_img: "/images/properties/airbus-1.jpg",
          property_title: "Cessna",
          property_price: "D-ABCD",
          category: "apartment",
          category_img: "/images/property_option/apartment.svg",
          rooms: 11.0,
          bathrooms: 8.3,
          location: "California",
          livingArea: "15",
          tag: "abgestellt",
          check: true,
          status: "Buy",
          type: "Apartment",
          beds: 2,
          garages: 0,
          region: "south",
          name: "Property 1",
          slug: "modern-apartment"
        },
      {
    id: '2',
    property_img: "/images/properties/aircraft-2.jpg",
    property_title: "Jet",
    property_price: "D-EFGH",
    category: "apartment",
    category_img: "/images/property_option/apartment.svg",
    rooms: 1.2,
    bathrooms: 4,
    location: "Texas",
    livingArea: "8",
    tag: "abgestellt",
    check: true,
    status: "Buy",
    type: "Apartment",
    beds: 3,
    garages: 1,
    region: "north",
    name: "Property 2",
    slug: "city-apartment"
  },
  {
    id: '3',
    property_img: "/images/properties/airbus-3.jpg",
    property_title: "Cirrus",
    property_price: "D-IJET",
    category: "apartment",
    category_img: "/images/property_option/apartment.svg",
    rooms: 35,
    bathrooms: 12,
    location: "New York",
    livingArea: "5",
    tag: "noch nicht",
    check: true,
    status: "Buy",
    type: "Apartment",
    beds: 4,
    garages: 1,
    region: "east",
    name: "Property 3",
    slug: "luxury-apartment"
  },] ;

    const [properties, setProperties] = useState<any[]>([])
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
                    {property.length > 0 ? 
                    property.slice(0, 6).map((property, index) => (
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