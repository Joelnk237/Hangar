"use client";
import React , { useEffect, useState }from 'react';
import HeroSub from '../../shared/hero-sub';
import DiscoverProperties from '../property-option';
import Util from './Util';
import { HangaranbieterTyp } from '@/app/types/property/hangaranbieter';



export default function HomeFBesitzer() {
  const [data, setData] = useState<HangaranbieterTyp | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch("http://localhost:8888/api/hangaranbieter/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden des dashboard");
        return res.json();
      })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8">…</p>;
  }

  if (!data) {
    return <p className="p-8 text-red-500">API Error</p>;
  }


  return (
    <>
      <HeroSub title={`Welcome ${data.general.firmenname}`}
          description={data.general.ort}
        />
      <DiscoverProperties hangaranbieter={data} />
      <Util />
    </>
  )
}