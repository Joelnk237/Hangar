"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Hangaranbieter from "@/app/components/profil/Hangaranbieter";
import Flugzeugbesitzer from "@/app/components/profil/Flugzeugbesitzer";
import { HangaranbieterTyp, HangaranbieterSpezialisierungen } from '@/app/types/property/hangaranbieter';
import { FlugzeugbesitzerTyp } from '@/app/types/property/flugzeugbesitzer';
import Loader from '@/app/components/shared/Loader';


function isHangaranbieter(data: any): data is HangaranbieterTyp {
  return data && "general" in data;
}

export default function Profil() {

  const router = useRouter();

  const [rolle, setRolle] = useState<string | null>(null);
  const [data, setData] = useState<HangaranbieterTyp | FlugzeugbesitzerTyp | null>(null);
    const [spezialisierungen, setSpezialisierungen] = useState<HangaranbieterSpezialisierungen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // user ablesen
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      router.push("/signin");
      return;
    }
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setRolle(user.rolle); // "hangaranbieter" oder "flugzeugbesitzer"
      } catch (err) {
        console.error("Error parsing", err);
      }
    }
  }, []);

  useEffect(() => {
    if(!rolle){
        return;
    }
    const token = localStorage.getItem("token");
    if(rolle === "hangaranbieter"){
        Promise.all([
        fetch("http://localhost:8888/api/hangaranbieter/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8888/api/hangaranbieter/spezialisierungen", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ])
        .then(async ([dashboardRes, spezRes]) => {
          if (!dashboardRes.ok) throw new Error("Dashboard Fehler");
          if (!spezRes.ok) throw new Error("Spezialisierungen Fehler");

          const dashboardData = await dashboardRes.json();
          const spezData = await spezRes.json();

          setData(dashboardData);
          setSpezialisierungen(spezData);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }else if(rolle === "flugzeugbesitzer"){
        fetch("http://localhost:8888/api/flugzeugbesitzer/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden");
        return res.json();
      })
      .then(setData)
      .finally(() => setLoading(false));
    }

  }, [rolle]);


  if (!rolle) {
    return null;
  }
  if(loading){
    return <Loader/>;
  }

  return (
    <main>
      {rolle === "flugzeugbesitzer" && data && !isHangaranbieter(data) && (
        <Flugzeugbesitzer data={data} />
      )}

      {rolle === "hangaranbieter" && data && isHangaranbieter(data) && spezialisierungen && (
        <Hangaranbieter data={data.general} spezialisierungen={spezialisierungen}/>
      )}
    </main>
  );
}
