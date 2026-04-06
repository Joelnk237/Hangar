"use client";

import React, { useEffect, useState } from 'react';
import Services from '@/app/components/services/Services';
import { useRouter } from "next/navigation";
import { allServicesTyp } from '@/app/types/property/allServices';
import Loader from '@/app/components/shared/Loader';


const Page = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState<allServicesTyp | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const [servicesRes, zusatzservicesRes] = await Promise.all([
          fetch("http://localhost:8888/api/hangaranbieter/services", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8888/api/hangaranbieter/zusatzservices", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // AUTH ERRORS
        if (servicesRes.status === 401 || zusatzservicesRes.status === 401) {
          router.push("/signin");
          return;
        }

        if (servicesRes.status === 403 || zusatzservicesRes.status === 403) {
          throw new Error("Zugriff verweigert");
        }

        if (!servicesRes.ok || !zusatzservicesRes.ok) {
          throw new Error("Fehler beim Laden der Services");
        }

        const services = await servicesRes.json();
        const zusatzservices = await zusatzservicesRes.json();

        setAllServices({ services, zusatzservices });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();


  }, [router]);


  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <div className="pt-20 text-center text-red-600">{error}</div>;
  }

  if (!allServices) return null;


  return <Services allServices={allServices} />;
};

export default Page;