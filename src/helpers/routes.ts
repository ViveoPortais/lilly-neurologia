import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
 LuFiles,
 LuFolderOpen,
 LuLayoutDashboard,
 LuLineChart,
 LuMousePointerClick,
 LuSlidersHorizontal,
 LuTestTube,
 LuUserPlus,
 LuUserX,
} from "react-icons/lu";
import { FaBoxArchive } from "react-icons/fa6";
import { IconType } from "react-icons/lib";

interface IProfileProps {
 route: string;
 text: string;
 summary?: string;
 icon: IconType;
 openModal?: boolean;
}

interface IRouteProps {
 [key: string]: IProfileProps[];
}

export const routes: IRouteProps = {
 doctor: [
  {
   route: "/dashboard/starts",
   text: "Início",
   icon: LuLayoutDashboard,
   summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
  },
  {
   route: "/dashboard/doctor/pendings",
   text: "Minhas Pendências",
   icon: HiOutlineExclamationCircle,
   summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
  },
  { route: "/dashboard/myRequests", text: "Minhas Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/doctor/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
  { route: "/dashboard/schedule-sample", text: "Agendar Retirada da Amostra", icon: LuTestTube },
  { route: "/dashboard/doctor/link-management", text: "Gerenciar Vínculo", icon: LuSlidersHorizontal },
  { route: "/dashboard/files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
 ],

 professional: [
  {
   route: "/dashboard/starts",
   text: "Início",
   icon: LuLayoutDashboard,
   summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
  },
  {
   route: "/dashboard/doctor/pendings",
   text: "Minhas Pendências",
   icon: HiOutlineExclamationCircle,
   summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
  },
  { route: "/dashboard/myRequests", text: "Minhas Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/professional/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
  { route: "/dashboard/schedule-sample", text: "Agendar Retirada da Amostra", icon: LuTestTube },
  { route: "/dashboard/professional/link-management", text: "Meus vínculos", icon: LuSlidersHorizontal },
  { route: "/dashboard/files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
 ],

 operation: [
  {
   route: "/dashboard/starts",
   text: "Início",
   icon: LuLayoutDashboard,
   summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
  },
  {
   route: "/dashboard/operation/pendings",
   text: "Minhas Pendências",
   icon: HiOutlineExclamationCircle,
   summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
  },
  { route: "/dashboard/operation/manage-files", text: "Gerenciar arquivos", icon: LuFiles, openModal: true },
  { route: "/dashboard/myRequests", text: "Acompanhar Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/operation/blocked-users", text: "Usuários bloqueados", icon: LuUserX },
  { route: "/dashboard/stock", text: "Estoque", icon: FaBoxArchive },
 ],

 logistics: [
  {
   route: "/dashboard/starts",
   text: "Início",
   icon: LuLayoutDashboard,
   summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
  },
  {
   route: "/dashboard/logistics/pendings",
   text: "Minhas Pendências",
   icon: HiOutlineExclamationCircle,
   summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
  },
  { route: "/dashboard/stock", text: "Estoque", icon: FaBoxArchive },
  { route: "/dashboard/myRequests", text: "Todas as solicitações", icon: LuMousePointerClick },
 ],
 client:[
    {
        route: "/dashboard/starts",
        text: "Início",
        icon: LuLayoutDashboard,
        summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
        route: "/dashboard/client/report",
        text: "Relatórios",
        icon: LuLineChart,
        summary: "Aqui você encontra tudo referente aos relatórios do programa.",
    },
 ]
};
