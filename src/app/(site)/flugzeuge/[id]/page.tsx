'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FlugzeugForm from "@/app/components/flugzeuge/FlugzeugForm";
import { FlugzeugFormData } from "@/app/types/property/flugzeug";

export default function EditFlugzeugPage() {
  const { id } = useParams();
  const [data, setData] = useState<FlugzeugFormData & { id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlugzeug = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8888/api/flugzeuge/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Fehler beim Laden des Flugzeugs");
        return;
      }

      const json = await res.json();

      setData({
        id: json.id,
        kennzeichen: json.kennzeichen,
        baujahr: json.baujahr ?? "",
        bild: null,
        flugzeugtyp: json.flugzeugtyp ?? "",
        flugzeuggroesse: json.flugzeuggroesse ?? "",
        flugstunden: json.flugstunden ?? "",
        flugkilometer: json.flugkilometer ?? "",
        treibstoffverbrauch: json.treibstoffverbrauch ?? "",
        frachtkapazitaet: json.frachtkapazitaet ?? "",
      });

      setLoading(false);
    };

    fetchFlugzeug();
  }, [id]);

  if (loading || !data) return <p>Lade...</p>;

  return (
    <FlugzeugForm
      mode="edit"
      initialData={data}
    />
  );
}
