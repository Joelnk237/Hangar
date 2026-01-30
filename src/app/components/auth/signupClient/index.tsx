"use client";

import {useEffect, useState } from "react";
import SignUpHA from "@/app/components/auth/sign-up-HA";
import SignUp from "@/app/components/auth/sign-up";
import { useRouter } from "next/navigation";

type Role = "hangar" | "owner" | null;

const SignupClient = () => {
  const router = useRouter();
  // Modal ist sofort offen
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  useEffect(() => {
  document.body.style.overflow = isModalOpen ? "hidden" : "";
}, [isModalOpen]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    router.push("/signin");
  };

  return (
    <>
      {/* Rollen-Auswahl Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          
          <div className="bg-white dark:bg-semidark p-6 rounded-lg w-96">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
              title="Schließen"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Wer sind Sie?
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect("owner")}
                className="w-full p-3 border rounded hover:bg-gray-100"
              >
                ✈️ Flugzeugbesitzer
              </button>

              <button
                onClick={() => handleRoleSelect("hangar")}
                className="w-full p-3 border rounded hover:bg-gray-100"
              >
                🏢 Hangaranbieter
              </button>

              <button disabled className="w-full p-3 border rounded opacity-50">
                🧩 Teileanbieter
              </button>

              <button disabled className="w-full p-3 border rounded opacity-50">
                🔧 Wartungsanbieter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Rendering der Signup-Formulare */}
      {!isModalOpen && selectedRole === "hangar" && <SignUpHA />}
      {!isModalOpen && selectedRole === "owner" && <SignUp />}
    </>
  );
};

export default SignupClient;
