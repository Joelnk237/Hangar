"use client";

import React, { useEffect, useState } from 'react';
import Nachrichten from '@/app/components/nachrichten';
import { useRouter } from "next/navigation";
import { Nachricht } from '@/app/types/property/nachricht';
import Loader from '@/app/components/shared/Loader';


const Page = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchData = async () => {
      try {

        const res = await fetch("http://localhost:8888/api/nachrichten/me", {
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
          throw new Error(text || "Fehler beim Laden der Nachrichten");
        }

        const data: Nachricht[] = await res.json();
        setNachrichten(data);
        


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

  if (!nachrichten) return null;


  return <Nachrichten nachrichten={nachrichten} />;
};

export default Page;