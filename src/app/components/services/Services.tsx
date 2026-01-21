"use client";

import { useState } from "react";
import { allServicesTyp } from "@/app/types/property/allServices";


/* ---------------- COMPONENT ---------------- */

const Services = ( { allServices }: { allServices: allServicesTyp }) => {
  /* ---------- STATES ---------- */

  const [services, setServices] = useState(allServices.services);
  const [zusatzservices, setZusatzservices] = useState(allServices.zusatzservices);

  const [editingService, setEditingService] = useState<number | null>(null);
  const [serviceDraft, setServiceDraft] = useState<allServicesTyp["services"][number] | null>(null);

  const [editingZusatzId, setEditingZusatzId] = useState<number | null>(null);
  const [zusatzDraft, setZusatzDraft] = useState<allServicesTyp["zusatzservices"][number] | null>(null);

  const hasServices = services && services.length > 0;
  const hasZusatzservices = zusatzservices && zusatzservices.length > 0;
  const disabledStyles = "opacity-50 blur-[1.5px] pointer-events-none select-none";


  /* ---------- HANDLERS SERVICES ---------- */

  const startEditService = (name: number) => {
    setEditingService(name);
    setServiceDraft({ ...services[name] });
  };

  const cancelEditService = () => {
    setEditingService(null);
    setServiceDraft(null);
  };

  const saveService = () => {
    if (!editingService || !serviceDraft) return;

    setServices((prev) => ({
      ...prev,
      [editingService]: serviceDraft,
    }));

    setEditingService(null);
    setServiceDraft(null);
  };

  /* ---------- HANDLERS ZUSATZSERVICES ---------- */

  const startEditZusatz = (zs: allServicesTyp["zusatzservices"][number]) => {
    setEditingZusatzId(zs.id);
    setZusatzDraft({ ...zs });
  };

  const cancelEditZusatz = () => {
    setEditingZusatzId(null);
    setZusatzDraft(null);
  };

  const saveZusatz = () => {
    if (!editingZusatzId || !zusatzDraft) return;

    setZusatzservices((prev) =>
      prev.map((z) => (z.id === editingZusatzId ? zusatzDraft : z))
    );

    setEditingZusatzId(null);
    setZusatzDraft(null);
  };

  const deleteZusatz = (id: number) => {
    setZusatzservices((prev) => prev.filter((z) => z.id !== id));
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="pt-20 pb-32 bg-light dark:bg-darkmode">
      <div className="pt-11 flex justify-center items-center">
        <div className="max-w-4xl w-full bg-white dark:bg-semidark px-8 py-14 sm:px-12 md:px-16 rounded-lg">
    <div className="space-y-10">

      {/* ================= SERVICES ================= */}
      <fieldset className=" relative border rounded-lg p-6">
        
        <legend className="px-2 text-lg font-semibold">Services</legend>
        <div className={!hasServices ? disabledStyles : ""}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isEditing = editingService === service.serviceId;

            return (
              <div
                key={service.serviceId}
                className="border rounded-lg p-4 flex flex-col justify-between"
              >
                <h4 className="font-semibold capitalize">{service.bezeichnung}</h4>

                {!isEditing ? (
                  <>
                    <p className="mt-2">
                      <span className="font-medium">Details:</span>{" "}
                      {service.preis} € / {service.einheit}
                    </p>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => startEditService(service.serviceId)}
                        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
                      >
                        bearbeiten
                      </button>
                      <button className="px-3 py-1 rounded bg-red-100 hover:bg-red-200">
                        löschen
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 space-y-2">
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={serviceDraft?.preis ?? ""}
                        onChange={(e) =>
                          setServiceDraft((prev) =>
                            prev ? { ...prev, price: Number(e.target.value) } : prev
                          )
                        }
                      />
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={serviceDraft?.einheit ?? ""}
                        onChange={(e) =>
                          setServiceDraft((prev) =>
                            prev ? { ...prev, unit: e.target.value } : prev
                          )
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={cancelEditService}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={saveService}
                        className="px-4 py-2 rounded bg-primary text-white"
                      >
                        Änderung speichern
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        </div>
        {!hasServices && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-semidark/80 px-4 py-3 rounded-lg shadow">
              Sie bieten noch keine Services an.
            </p>
          </div>
        )}

      </fieldset>
      <div className="flex justify-end gap-4">
        <button className="px-5 py-2 rounded bg-blue-600 text-white">
          Add Service
        </button>
      </div>

      {/* ================= ZUSATZSERVICES ================= */}
      <fieldset className="border rounded-lg p-6">
        
        <legend className="px-2 text-lg font-semibold">Zusatzservices</legend>
        <div className={!hasZusatzservices ? disabledStyles : ""}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zusatzservices.map((zs) => {
            const isEditing = editingZusatzId === zs.id;

            return (
              <div
                key={zs.id}
                className="border rounded-lg p-4 flex flex-col"
              >
                {!isEditing ? (
                  <>
                    <h4 className="font-semibold">{zs.bezeichnung}</h4>

                    <p className="mt-2">
                      <span className="font-medium">Description:</span>{" "}
                      {zs.beschreibung}
                    </p>

                    <p className="mt-1">
                      <span className="font-medium">Details:</span>{" "}
                      {zs.preis} € / {zs.einheit}
                    </p>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => startEditZusatz(zs)}
                        className="px-3 py-1 rounded bg-blue-100"
                      >
                        bearbeiten
                      </button>
                      <button
                        onClick={() => deleteZusatz(zs.id)}
                        className="px-3 py-1 rounded bg-red-100"
                      >
                        löschen
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      className="border rounded px-3 py-2 mb-2"
                      value={zusatzDraft?.bezeichnung ?? ""}
                      onChange={(e) =>
                        setZusatzDraft((prev) =>
                          prev ? { ...prev, bezeichnung: e.target.value } : prev
                        )
                      }
                    />
                    <textarea
                      className="border rounded px-3 py-2 mb-2"
                      rows={3}
                      value={zusatzDraft?.beschreibung ?? ""}
                      onChange={(e) =>
                        setZusatzDraft((prev) =>
                          prev ? { ...prev, beschreibung: e.target.value } : prev
                        )
                      }
                    />
                    <input
                      type="number"
                      className="border rounded px-3 py-2 mb-2"
                      value={zusatzDraft?.preis ?? ""}
                      onChange={(e) =>
                        setZusatzDraft((prev) =>
                          prev ? { ...prev, price: Number(e.target.value) } : prev
                        )
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      value={zusatzDraft?.einheit ?? ""}
                      onChange={(e) =>
                        setZusatzDraft((prev) =>
                          prev ? { ...prev, unit: e.target.value } : prev
                        )
                      }
                    />

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={cancelEditZusatz}
                        className="px-4 py-2 rounded bg-gray-200"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={saveZusatz}
                        className="px-4 py-2 rounded bg-primary text-white"
                      >
                        Änderung speichern
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        </div>
        {!hasZusatzservices && (
          <div className="inset-0 flex items-center justify-center text-center px-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-semidark/80 px-4 py-3 rounded-lg shadow">
              Sie bieten noch keine Zusatzservices an.
            </p>
          </div>
        )}

      </fieldset>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-4">
        <button className="px-5 py-2 rounded bg-green-600 text-white">
          Add Zusatzservice
        </button>
      </div>
    </div></div></div></div>
  );
};

export default Services;
