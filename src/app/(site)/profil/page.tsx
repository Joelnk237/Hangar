"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Hangaranbieter from "@/app/components/profil/Hangaranbieter";
import Flugzeugbesitzer from "@/app/components/profil/Flugzeugbesitzer";
import { HangaranbieterTyp } from '@/app/types/property/hangaranbieter';
import { FlugzeugbesitzerTyp } from '@/app/types/property/flugzeugbesitzer';


function isHangaranbieter(data: any): data is HangaranbieterTyp {
  return data && "general" in data;
}

export default function Profil() {

  const router = useRouter();

  const [rolle, setRolle] = useState<string | null>(null);
  const [data, setData] = useState<HangaranbieterTyp | FlugzeugbesitzerTyp | null>(null);
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
    if(rolle === "hangaranbieter"){
        fetch("http://localhost:8888/api/hangaranbieter/dashboard", {
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

  return (
    <main>
      {rolle === "flugzeugbesitzer" && data && !isHangaranbieter(data) && (
        <Flugzeugbesitzer data={data} />
      )}

      {rolle === "hangaranbieter" && data && isHangaranbieter(data) && (
        <Hangaranbieter data={data.general} />
      )}
    </main>
  );
}
