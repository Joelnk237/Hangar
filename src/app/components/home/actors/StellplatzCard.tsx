import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../style/index.css";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Stellplatz } from "@/app/types/property/stellplatz";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import toast , { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";


interface StellplatzCardProps {
  stellplatz: Stellplatz;
  viewMode?: string;
  showActions?: boolean;
}

const StellplatzCard: React.FC<StellplatzCardProps> = ({ stellplatz, viewMode, showActions }) => {
  const router=useRouter();
  
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const serviceLabels = stellplatz.services
  ?.map(service => service.bezeichnung)
  .join(", ");
  
  
  const toggleAvailability = async (
  e: React.MouseEvent,
  stellplatzId: string,
  currentAvailability: boolean
) => {
  e.preventDefault(); // 

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8888/api/stellplaetze/${stellplatzId}/availability`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          availability: !currentAvailability,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Update fehlgeschlagen");
    }

    toast.success(
      !currentAvailability
        ? "Stellplatz freigegeben"
        : "Stellplatz deaktiviert"
    );

    window.location.reload(); // reloading
  } catch (err) {
    console.error(err);
    toast.error("Fehler beim Aktualisieren");
  }
};

const handleDeleteStellplatz = async () => {
  setDeleteLoading(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8888/api/stellplaetze/${stellplatz.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 409) {
      toast.error(
        "Dieser Stellplatz ist aktuell oder zukünftig gebucht und kann nicht gelöscht werden"
      );
      setShowDeleteModal(false);
      return;
    }

    if (!res.ok) {
      throw new Error("Löschen fehlgeschlagen");
    }

    toast.success("Stellplatz erfolgreich gelöscht");
    setShowDeleteModal(false);
    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error("Fehler beim Löschen des Stellplatzes");
  } finally {
    setDeleteLoading(false);
  }
};


  
  return (
  <>
  <Toaster />
    <div
      key={stellplatz.id}
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden`}
      data-aos="fade-up"
    >
      <Link href={``} className={`group ${viewMode=="list" && 'flex' }`}>
        <div className={`relative ${viewMode=="list" && 'w-[30%]'}`}>
          <div className={`imageContainer h-[250px] w-full ${viewMode =="list" && 'h-full md:h-52'}`}>
            <Image
              src={stellplatz.bild
      ? `http://localhost:8888${stellplatz.bild}`
      : "/images/properties/stellplatz-placeholder.jpg"}
              alt={`Image of place ${stellplatz.id}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          <p className="absolute top-[10px] left-[10px] py-1 px-4 bg-white rounded-md text-primary items-center">
            {stellplatz.availability ? `verfügbar`: `nicht verfügbar`} {/* METTRE LE TAG */}
          </p>
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#2F73F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole-open-icon lucide-lock-keyhole-open absolute top-[10px] right-[10px] bg-white p-2 rounded-lg"><circle cx="12" cy="16" r="1"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 9.33-2.5"/></svg>

        </div>
        <div className={`p-5 sm:p-8 dark:text-white text-opacity-50 ${viewMode=="list" && 'w-[70%] flex flex-col justify-center'}`}>

          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            
            <div>
              <p className="text-base text-gray">
                {stellplatz.flugzeugtyp}
              </p>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl group-hover:text-primary text-midnight_text dark:text-white">
                {stellplatz.kennzeichen}
              </div>
              <div className="text-xs bg-[#DAE7FF] dark:bg-white text-midnight_text dark:text-primary py-1 px-2 rounded-lg font-bold">
                {stellplatz.standort}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            <div className="flex flex-row">
              {stellplatz.services && stellplatz.services.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <span className="font-semibold text-midnight_text dark:text-white">
                    Services:
                  </span>{" "}
                  {serviceLabels}
                </p>
              )}{!stellplatz.services || stellplatz.services.length <= 0 && (<p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Keine Service</p>)}
            </div>
            {showActions && (
        <div className="flex justify-end gap-3 px-5 pb-4">
          <button
            onClick={(e) =>
              toggleAvailability(e, stellplatz.id, stellplatz.availability)
            }
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            title={stellplatz.availability ? "Stellplatz als nicht verfügbar markieren": "Stellplatz freigeben"}
          >
            {stellplatz.availability?( <LockKeyhole size={18} />):(<LockKeyholeOpen size={18}/>)}
          </button>

          <button
            onClick={(e) => {
            e.preventDefault();
            router.push(`/stellplaetze/stellplaetzeDashboard/edit/${stellplatz.id}`);
          }}
            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
            title="bearbeiten"
          >
            <Edit size={18} />
          </button>

          <button
          onClick={(e) => {
            e.preventDefault();
            setShowDeleteModal(true);
          }}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition"
            title="löschen"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
          </div>
        </div>
      </Link>
    </div>

    {showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-semidark rounded-lg p-6 w-full max-w-md space-y-4">

      <h2 className="text-lg font-semibold text-red-600">
        Stellplatz löschen
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Sind Sie sicher, dass Sie diesen Stellplatz endgültig löschen möchten?
        Diese Aktion kann nicht rückgängig gemacht werden.
      </p>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Abbrechen
        </button>

        <button
          disabled={deleteLoading}
          onClick={handleDeleteStellplatz}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {deleteLoading ? "Löschen..." : "Bestätigen"}
        </button>
      </div>
    </div>
  </div>
)}
</>

  );
};

export default StellplatzCard;
