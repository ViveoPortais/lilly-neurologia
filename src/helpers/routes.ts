import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
 LuFiles,
 LuFolderOpen,
 LuLayoutDashboard,
 LuMousePointerClick,
 LuSlidersHorizontal,
 LuTestTube,
 LuUserPlus,
 LuUserX,
} from "react-icons/lu";
import { IconType } from "react-icons/lib";

interface IProfileProps {
 route: string;
 text: string;
 summary?: string;
 icon: IconType;
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
  { route: "/dashboard/doctor/requests", text: "Minhas Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/doctor/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
  { route: "/dashboard/doctor/sample-collection", text: "Agendar Retirada da Amostra", icon: LuTestTube },
  { route: "/dashboard/doctor/link-management", text: "Gerenciar Vínculo", icon: LuSlidersHorizontal },
  { route: "/dashboard/doctor/files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
 ],

 professional: [
  {
   route: "/dashboard/starts",
   text: "Início",
   icon: LuLayoutDashboard,
   summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
  },
  {
   route: "/dashboard/professional/pendings",
   text: "Minhas Pendências",
   icon: HiOutlineExclamationCircle,
   summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
  },
  { route: "/dashboard/professional/requests", text: "Minhas Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/professional/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
  { route: "/dashboard/professional/sample-collection", text: "Agendar Retirada da Amostra", icon: LuTestTube },
  { route: "/dashboard/professional/link-management", text: "Meus vínculos", icon: LuSlidersHorizontal },
  { route: "/dashboard/professional/files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
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
  { route: "/dashboard/operation/register-patient", text: "Gerenciar arquivos", icon: LuFiles },
  { route: "/dashboard/operation/requests", text: "Acompanhar Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/operation/register-patient", text: "Usuários bloqueados", icon: LuUserX },
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
  { route: "/dashboard/logistics/requests", text: "Minhas Solicitações", icon: LuMousePointerClick },
  { route: "/dashboard/logistics/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
  { route: "/dashboard/logistics/sample-collection", text: "Agendar Retirada da Amostra", icon: LuTestTube },
  { route: "/dashboard/logistics/link-management", text: "Meus vínculos", icon: LuSlidersHorizontal },
  { route: "/dashboard/logistics/files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
 ],
};
