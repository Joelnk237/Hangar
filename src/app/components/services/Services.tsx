"use client";

import { useState } from "react";
import { allServicesTyp, ServiceDefinition, SERVICE_DEFINITIONS } from "@/app/types/property/allServices";
import { useRouter } from "next/navigation";


/* ---------------- COMPONENT ---------------- */

const Services = ( { allServices }: { allServices: allServicesTyp }) => {
  const router = useRouter();

  
  /* ---------- STATES ---------- */


  const [services, setServices] = useState(allServices.services);
  const [zusatzservices, setZusatzservices] = useState(allServices.zusatzservices);

  const [editingService, setEditingService] = useState<number | null>(null);
  const [serviceDraft, setServiceDraft] = useState<allServicesTyp["services"][number] | null>(null);

  const [editingZusatzId, setEditingZusatzId] = useState<number | null>(null);
  const [zusatzDraft, setZusatzDraft] = useState<allServicesTyp["zusatzservices"][number] | null>(null);

 //ajouter
const [showAddServiceModal, setShowAddServiceModal] = useState(false);
const [showAddZusatzModal, setShowAddZusatzModal] = useState(false);
const [showAllServicesInfoModal, setShowAllServicesInfoModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);


type NewServiceDraft = {
  serviceId: number;
  preis: number | "";
  einheit: string;
  checked: boolean;
};
type NewZusatzDraft = {
  bezeichnung: string;
  beschreibung: string;
  preis: number | "";
  einheit: string;
};

//zu wissen, ob es ein Service vs. Zusatz
const [deleteTarget, setDeleteTarget] = useState<{
  type: "service" | "zusatz";
  id: number;
  label: string;
} | null>(null);

const [newZusatz, setNewZusatz] = useState<NewZusatzDraft>({
  bezeichnung: "",
  beschreibung: "",
  preis: "",
  einheit: "",
});

const [newServices, setNewServices] = useState<NewServiceDraft[]>([]);

//---------
  const hasServices = services && services.length > 0;
  const hasZusatzservices = zusatzservices && zusatzservices.length > 0;
  const disabledStyles = "opacity-50 blur-[1.5px] pointer-events-none select-none";


//ajouter
const offeredServiceIds = services.map(s => s.serviceId);

const missingServices = SERVICE_DEFINITIONS.filter(
  def => !offeredServiceIds.includes(def.serviceId)
);

const canAddService = missingServices.length > 0;

//--------
// Utility : Fetcher
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:8888${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    window.location.href = "/signin";
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  //router.push("/services");
};


  /* ---------- HANDLERS SERVICES ---------- */

  const startEditService = (service: allServicesTyp["services"][number]) => {
  setEditingService(service.serviceId);
  setServiceDraft({ ...service });
};
  const cancelEditService = () => {
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

  

  const deleteZusatz = (id: number) => {
    setZusatzservices((prev) => prev.filter((z) => z.id !== id));
  };

  /*-----------ADD & MODIFY SERVICE----------- */
  const openAddServiceModal = () => {
  if (!canAddService) {
   setShowAllServicesInfoModal(true);
    return;
  }

  setNewServices(
    missingServices.map(s => ({
      serviceId: s.serviceId,
      preis: "",
      einheit: "",
      checked: false,
    }))
  );

  setShowAddServiceModal(true);
};

//FETCH FONCTIONS
const confirmAddServices = async () => {
  const payload = newServices
    .filter(s => s.checked)
    .map(s => ({
      serviceId: s.serviceId,
      preis: s.preis,
      einheit: s.einheit,
    }));

  if (payload.length === 0) return;
  console.log("NEW SERVICE",payload);

  try {
    await apiFetch("/api/hangaranbieter/services", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setShowAddServiceModal(false);
    router.push("/services");
  } catch (err) {
    alert("Fehler beim Hinzufügen der Services");
    console.error(err);
  }
};


const saveService = async () => {
  if (!serviceDraft) return;

  const payload = {
    serviceId: serviceDraft.serviceId,
    preis: serviceDraft.preis,
    einheit: serviceDraft.einheit,
  };

  try {
    await apiFetch("/api/hangaranbieter/services", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setEditingService(null);
    setServiceDraft(null);
    router.push("/services");
  } catch (err) {
    alert("Fehler beim Aktualisieren des Services");
    console.error(err);
  }

  console.log("UPDATE SERVICE", payload);
};

const saveNewZusatzservice = async () => {
  if (!isAddZusatzValid) return;

  const payload = {
    bezeichnung: newZusatz.bezeichnung,
    beschreibung: newZusatz.beschreibung,
    preis: newZusatz.preis,
    einheit: newZusatz.einheit,
  };

  console.log("NEW ZUSATZSERVICE PAYLOAD", payload);

  try {
    await apiFetch("/api/hangaranbieter/zusatzservices", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setShowAddZusatzModal(false);
    setNewZusatz({
      bezeichnung: "",
      beschreibung: "",
      preis: "",
      einheit: "",
    });
    router.push("/services");
  } catch (err) {
    alert("Fehler beim Erstellen des Zusatzservices");
    console.error(err);
  }
};

const saveZusatz = async () => {
    if (!editingZusatzId || !zusatzDraft) return;

  const payload = {
    id: zusatzDraft.id,
    bezeichnung: zusatzDraft.bezeichnung,
    beschreibung: zusatzDraft.beschreibung,
    preis: zusatzDraft.preis,
    einheit: zusatzDraft.einheit,
  };

  try {
    await apiFetch("/api/hangaranbieter/zusatzservices", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setEditingZusatzId(null);
    setZusatzDraft(null);
    router.push("/services");
  } catch (err) {
    alert("Fehler beim Aktualisieren des Zusatzservices");
    console.error(err);
  }
  };

  const confirmDeleteService = (service: allServicesTyp["services"][number]) => {
  setDeleteTarget({
    type: "service",
    id: service.serviceId,
    label: service.bezeichnung,
  });
  setShowDeleteModal(true);
};
const confirmDeleteZusatz = (zs: allServicesTyp["zusatzservices"][number]) => {
  setDeleteTarget({
    type: "zusatz",
    id: zs.id,
    label: zs.bezeichnung,
  });
  setShowDeleteModal(true);
};

const executeDelete = async () => {
  if (!deleteTarget) return;

  try {
    if (deleteTarget.type === "service") {
      await apiFetch(`/api/hangaranbieter/services/${deleteTarget.id}`, {
        method: "DELETE",
      });
    }

    if (deleteTarget.type === "zusatz") {
      await apiFetch(`/api/hangaranbieter/zusatzservices/${deleteTarget.id}`, {
        method: "DELETE",
      });
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);

    // reload
    router.push("/services");

  } catch (err) {
    alert("Fehler beim Löschen");
    console.error(err);
  }
};





//VALIDATION
const checkedServices = newServices.filter(s => s.checked);

const isAddServiceValid =
  checkedServices.length > 0 &&
  checkedServices.every(
    s => s.preis !== "" && s.preis > 0 && s.einheit !== ""
  );

const isEditServiceValid =
  serviceDraft !== null &&
  serviceDraft.preis !== null &&
  serviceDraft.preis > 0 &&
  serviceDraft.einheit !== "";

const isAddZusatzValid =
  newZusatz.bezeichnung.trim() !== "" &&
  newZusatz.preis !== "" &&
  newZusatz.preis > 0 &&
  newZusatz.einheit.trim() !== "";





  /* ---------------- RENDER ---------------- */

  return (
   <> 
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
            const serviceDef = SERVICE_DEFINITIONS.find(
                  d => d.serviceId === service.serviceId
                )!;
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
                        onClick={() => startEditService(service)}
                        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
                      >
                        bearbeiten
                      </button>
                      <button 
                      onClick={() => confirmDeleteService(service)}
                      className="px-3 py-1 rounded bg-red-100 hover:bg-red-200">
                        löschen
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                  
                    <div className="mt-2 space-y-2">
                      <input
                        type="number"
                        placeholder="Preis"
                        className="w-full border rounded px-3 py-2"
                        value={serviceDraft?.preis ?? ""}
                        onChange={(e) =>
                          setServiceDraft((prev) =>
                            prev ? { ...prev, preis: Number(e.target.value) } : prev
                          )
                        }
                      />
                      <select
                          value={serviceDraft?.einheit ?? ""}
                          onChange={(e) =>
                            setServiceDraft(prev =>
                              prev ? { ...prev, einheit: e.target.value } : prev
                            )
                          }
                        >
                          {serviceDef.einheiten.map(e => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                      </select>

                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={cancelEditService}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Abbrechen
                      </button>
                      <button
                        disabled={!isEditServiceValid}
                        onClick={saveService}
                        className={`px-4 py-2 rounded  ${isEditServiceValid? "text-white bg-primary": "bg-gray-900 cursor-not-allowed"}`}
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
        <button 
        onClick={openAddServiceModal}
        disabled={editingService !== null}
        className="px-5 py-2 rounded bg-blue-600 text-white">
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
                        onClick={() => confirmDeleteZusatz(zs)}
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
                          prev ? { ...prev, preis: Number(e.target.value) } : prev
                        )
                      }
                    />
                    <input
                      className="border rounded px-3 py-2"
                      value={zusatzDraft?.einheit ?? ""}
                      onChange={(e) =>
                        setZusatzDraft((prev) =>
                          prev ? { ...prev, einheit: e.target.value } : prev
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
        <button 
        onClick={() => setShowAddZusatzModal(true)}
        className="px-5 py-2 rounded bg-green-600 text-white">
          Add Zusatzservice
        </button>
      </div>
    </div></div>
    </div>
    </div>

    {showAddServiceModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white dark:bg-semidark w-full max-w-3xl rounded-lg p-6 space-y-6">

              <h3 className="text-lg font-semibold">
                Services hinzufügen
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missingServices.map(def => {
                  const draft = newServices.find(d => d.serviceId === def.serviceId)!;

                  return (
                    <div key={def.serviceId} className="border rounded-lg p-4">
                      <label className="flex items-center gap-2 font-semibold">
                        <input
                          type="checkbox"
                          checked={draft.checked}
                          onChange={(e) =>
                            setNewServices(prev =>
                              prev.map(d =>
                                d.serviceId === def.serviceId
                                  ? { ...d, checked: e.target.checked }
                                  : d
                              )
                            )
                          }
                        />
                        {def.bezeichnung}
                      </label>

                      <div className={`mt-3 space-y-2 ${!draft.checked ? "opacity-50 pointer-events-none" : ""}`}>
                        <input
                          type="number"
                          placeholder="Preis"
                          className="w-full border rounded px-3 py-2"
                          value={draft.preis}
                          onChange={(e) =>
                            setNewServices(prev =>
                              prev.map(d =>
                                d.serviceId === def.serviceId
                                  ? { ...d, preis: Number(e.target.value) }
                                  : d
                              )
                            )
                          }
                        />

                        <select
                          className="w-full border rounded px-3 py-2"
                          value={draft.einheit}
                          onChange={(e) =>
                            setNewServices(prev =>
                              prev.map(d =>
                                d.serviceId === def.serviceId
                                  ? { ...d, einheit: e.target.value }
                                  : d
                              )
                            )
                          }
                        >
                          <option value="">Einheit wählen</option>
                          {def.einheiten.map(e => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  Abbrechen
                </button>

                <button
                  disabled={!isAddServiceValid}
                  onClick={() => {
                    confirmAddServices();
                    setShowAddServiceModal(false);
                  }}
                  className={`px-4 py-2 rounded text-black ${isAddServiceValid? "bg-primary": "bg-gray-900 cursor-not-allowed"}`}
                >
                  Bestätigen
                </button>
              </div>

            </div>
          </div>
        )}

        {/** ZUSATZSERVICE MODAL */}
        {showAddZusatzModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
              <div className="bg-white dark:bg-semidark w-full max-w-lg rounded-lg p-6 space-y-5">

                <h3 className="text-lg font-semibold">
                  Zusatzservice hinzufügen
                </h3>

                <input
                  type="text"
                  placeholder="Bezeichnung"
                  className="w-full border rounded px-3 py-2"
                  value={newZusatz.bezeichnung}
                  onChange={(e) =>
                    setNewZusatz(prev => ({ ...prev, bezeichnung: e.target.value }))
                  }
                />

                <textarea
                  rows={4}
                  placeholder="Beschreibung"
                  className="w-full border rounded px-3 py-2"
                  value={newZusatz.beschreibung}
                  onChange={(e) =>
                    setNewZusatz(prev => ({ ...prev, beschreibung: e.target.value }))
                  }
                />

                <input
                  type="number"
                  placeholder="Preis"
                  className="w-full border rounded px-3 py-2"
                  value={newZusatz.preis}
                  onChange={(e) =>
                    setNewZusatz(prev => ({ ...prev, preis: Number(e.target.value) }))
                  }
                />

                <input
                  type="text"
                  placeholder="Einheit (z.B. pauschal, pro Vorgang)"
                  className="w-full border rounded px-3 py-2"
                  value={newZusatz.einheit}
                  onChange={(e) =>
                    setNewZusatz(prev => ({ ...prev, einheit: e.target.value }))
                  }
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowAddZusatzModal(false)}
                    className="px-4 py-2 rounded bg-gray-200"
                  >
                    Abbrechen
                  </button>

                  <button
                    disabled={!isAddZusatzValid}
                    onClick={saveNewZusatzservice}
                    className={`px-4 py-2 rounded text-white
                      ${isAddZusatzValid
                        ? "bg-primary"
                        : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Speichern
                  </button>
                </div>

              </div>
            </div>
          )}
    {/**MODAL : ALLE SERVICES SCHON ANGEBOTEN */}
          {showAllServicesInfoModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white dark:bg-semidark max-w-md w-full rounded-lg p-6 space-y-4">

      <h3 className="text-lg font-semibold text-center">
        Alle Services bereits angeboten
      </h3>

      <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
        Sie bieten bereits alle von der Plattform vorgesehenen Services an.
        <br /><br />
        Wenn Sie weitere Leistungen anbieten möchten, nutzen Sie bitte die
        Option <strong>„Zusatzservice“</strong>.
      </p>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => setShowAllServicesInfoModal(false)}
          className="px-5 py-2 rounded bg-primary text-white"
        >
          Verstanden
        </button>
      </div>

    </div>
  </div>
)}
{/** MODAL LÖSCHUNG */}
{showDeleteModal && deleteTarget && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white dark:bg-semidark max-w-md w-full rounded-lg p-6 space-y-5">

      <h3 className="text-lg font-semibold text-center text-red-600">
        Service löschen
      </h3>

      <p className="text-sm text-center text-gray-700 dark:text-gray-300">
        Möchten Sie den folgenden Service wirklich löschen?
        <br /><br />
        <strong>{deleteTarget.label}</strong>
        <br /><br />
        Diese Aktion kann nicht rückgängig gemacht werden.
      </p>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          className="px-4 py-2 rounded bg-gray-200"
        >
          Abbrechen
        </button>

        <button
          onClick={executeDelete}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Löschen
        </button>
      </div>

    </div>
  </div>
)}





    </>

    
  ); 
};

export default Services;
