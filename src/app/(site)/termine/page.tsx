"use client";

import React, { useEffect, useState } from 'react';
import Termine from '@/app/components/termine';
import { useRouter } from "next/navigation";
import { Termin } from '@/app/types/property/termin';
import Loader from '@/app/components/shared/Loader';


const Page = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [termine, setTermine] = useState<Termin[]>([]);;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchData = async () => {
      try {

        const res = await fetch("http://localhost:8888/api/termine/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          router.push("/signin");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Fehler beim Laden der Termine");
        }

        const data: Termin[] = await res.json();
        setTermine(data);
        


      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unbekannter Fehler");
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

  if (!termine) return null;


  return <Termine termine={termine} />;
};

export default Page;