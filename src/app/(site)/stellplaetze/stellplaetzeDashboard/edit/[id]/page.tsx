'use client'
import React, { useEffect, useState } from 'react';
import NewStellplatz from '@/app/components/home/Stellplaetze/NewStellplatz';
import { StellplatzInfos } from '@/app/types/property/stellplatzInfos';


type PageProps = {
  params: Promise<{ id: string }>;
};
const Page = ({ params }: PageProps) => {
    const { id } = React.use(params);

    const [stellplatzFromDB, setStellplatz] = useState<StellplatzInfos | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

useEffect(() => {
    async function fetchStellplatz() {
      try {
        const res = await fetch(`http://localhost:8888/api/stellplaetze/${id}/toupdate`);
        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();
        setStellplatz(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStellplatz();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stellplatzFromDB) return <div>Details nicht gefunden</div>;
  return (
    <>
      <NewStellplatz mode="edit"
        stellplatzInfos={stellplatzFromDB}/>
    </>
  );
};

export default Page;