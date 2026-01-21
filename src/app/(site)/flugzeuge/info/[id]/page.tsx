'use client'
import React, { useEffect, useState } from 'react';
import FlugzeugInfo from '@/app/components/flugzeuge/FlugzeugInfo';
import Loader from '@/app/components/shared/Loader';
import { FlugzeugInfoProps } from "@/app/types/property/flugzeug";
import { authFetch } from '@/utils/lib/authFetch';


const Page = ({ params }: { params: { id: string } }) => {
    const { id } = params;

  const [flugzeugInfosFromDB, setFlugzeugInfos] = useState<FlugzeugInfoProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlugzeugInfos() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8888/api/flugzeuge/${id}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();
        setFlugzeugInfos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlugzeugInfos();
  }, [id]);

  if (loading) return <Loader/>;
  if (error) return <div>{error}</div>;
  if (!flugzeugInfosFromDB) return <div>Details nicht gefunden</div>;

  return (
    <>
      <FlugzeugInfo
  flugzeugInfos={flugzeugInfosFromDB}
    />
    </>
  );
};

export default Page;