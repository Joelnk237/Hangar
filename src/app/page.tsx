"use client";
import React, { useEffect, useState } from 'react';
//import { Metadata } from "next";
import { useRouter } from "next/navigation";
import HomeFBesitzer from './components/home/actors/HomeFBesitzer';
import HomeHAnbieter from './components/home/actors/HomeHAnbieter';




export default function Home() {

  const router = useRouter();

  const [rolle, setRolle] = useState<string | null>(null);

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

  if (!rolle) {
    return null;
  }

  return (
    <main>
      {rolle === "flugzeugbesitzer" ? <HomeFBesitzer /> : <HomeHAnbieter />}
    </main>
  );
}
