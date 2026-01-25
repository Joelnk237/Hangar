'use client'
import React, { useEffect, useState } from 'react';
import StellplatzInfos from '@/app/components/home/Stellplaetze/StellplatzInfos';
import { StellplatzInfosProps } from "@/app/types/property/stellplatzData";

type PageProps = {
  params: Promise<{ id: string }>;
};
const Page = ({ params }: PageProps) => {
    const { id } = React.use(params);

  const [stellplatzFromDB, setStellplatz] = useState<StellplatzInfosProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStellplatz() {
      try {
        const res = await fetch(`http://localhost:8888/api/stellplaetze/${id}/details`);
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
      <StellplatzInfos
  stellplatz={stellplatzFromDB}
    />
    </>
  );
};

export default Page;