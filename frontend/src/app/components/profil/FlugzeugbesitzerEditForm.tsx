"use client";

import { useState } from "react";
import { FlugzeugbesitzerTyp } from "@/app/types/property/flugzeugbesitzer";
import toast from "react-hot-toast";

type Props = {
  initialData: FlugzeugbesitzerTyp;
  onCancel: () => void;
  onSaved: (data: FlugzeugbesitzerTyp) => void;
};

export default function FlugzeugbesitzerEditForm({ initialData, onCancel, onSaved }: Props) {
  const [formData, setFormData] = useState({ ...initialData });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8888/api/flugzeugbesitzer/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();

        if (res.status === 409 && text === "EMAIL_ALREADY_USED") {
          toast.error("Diese Email existiert bereits im System");
          return;
        }

        throw new Error(text);
      }

      const updated = await res.json();
      toast.success("Profil aktualisiert ✅");
      onSaved(updated);
      window.location.reload();

    } catch (err) {
      console.error(err);
      toast.error("Update fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-semidark rounded shadow">

      <h2 className="text-xl font-bold">Profil bearbeiten</h2>

      <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Telefonnummer"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder  bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Straße"
                name="strasse"
                value={formData.strasse}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Hausnummer"
                name="hausnummer"
                value={formData.hausnummer}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Postleitzahl"
                name="plz"
                value={formData.plz}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
              <input
                type="text"
                placeholder="Ort"
                name="ort"
                value={formData.ort}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border dark:border-darkborder border-solid bg-transparent px-5 py-3 text-base text-midnight_text outline-none transition placeholder:text-gray-300 focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary"
              />
            </div>


      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
          Abbrechen
        </button>

        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
          Änderung speichern {loading && "..."}
        </button>
      </div>
    </form>
  );
}
