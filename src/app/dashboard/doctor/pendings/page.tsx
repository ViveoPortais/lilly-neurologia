import { GenericPendingsPage } from "@/components/pendings/GenericPendingsPage";

export default function PendingsDoctorPage() {
 const pendings = [
  {
   title: "Documentação",
   count: 3,
   items: [
    {
     id: "1",
     columns: ["23482–3954", "Lorem Ipsum da Silva", "27/04/25", "29/04/25"],
     reason: "Documentação Pendentes",
    },
    {
     id: "2",
     columns: ["23482–3955", "João Souza", "26/04/25", "28/04/25"],
     reason: "Documentação Incompleta",
    },
    {
     id: "3",
     columns: ["23482–3955", "João Souza", "26/04/25", "28/04/25"],
     reason: "Documentação Incompleta",
    },
   ],
  },
  {
   title: "Solicitações de Retirada de Amostra",
   count: 0,
   items: [],
  },
 ];

 return <GenericPendingsPage categories={pendings} />;
}
