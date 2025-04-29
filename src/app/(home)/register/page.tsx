"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/custom/CustomSelect";
import MedicalSignUpModal from "@/components/modals/RegisterModal";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const handleContinue = () => {
    if (role) {
      setShowModal(true);
    }
  };

  return (
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-zinc-800 text-left">Realizar cadastro</h2>
        <CustomSelect
          name="userRole"
          label="Escolha seu perfil:"
          value={role}
          onChange={(value: string) => setRole(value)}
          options={[
            { id: "medico", value: "Médico" },
          ]}
          customClass="w-full border rounded mb-10"
        />

        <Button variant="default" className="w-full" onClick={handleContinue} disabled={!role}>
          Seguir
        </Button>
        <Button variant="outlineMainlilly" className="w-full" onClick={() => router.back()}>
          Voltar
        </Button>

        {showModal && <MedicalSignUpModal role={role} onClose={() => setShowModal(false)} />}
      </div>
  );
}
