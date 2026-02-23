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

export type ProgramSlug = "neurologia" | "oncologia";
export type AppRole = "doctor" | "professional" | "operation" | "logistics" | "client";

export interface IMenuItem {
  path: string;
  text: string;
  summary?: string;
  icon: IconType;
  openModal?: boolean;
}

export type RoleRoutes = Record<AppRole, IMenuItem[]>;

export function buildDashboardHref(programSlug: ProgramSlug, path: string) {
  const cleanPath = (path || "").replace(/^\/|\/$/g, "");
  return `/${programSlug}/dashboard/${cleanPath}`;
}

/**
 * ROTAS BASE (o que é igual entre programas)
 */
const baseRoutes: RoleRoutes = {
  doctor: [
    {
      path: "starts",
      text: "Início",
      icon: LuLayoutDashboard,
      summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
      path: "doctor/pendings",
      text: "Minhas Pendências",
      icon: HiOutlineExclamationCircle,
      summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
    },
    { path: "myRequests", text: "Minhas Solicitações", icon: LuMousePointerClick },
    { path: "doctor/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
    { path: "schedule-sample", text: "Agendar Retirada da Amostra", icon: LuTestTube },
    { path: "doctor/link-management", text: "Gerenciar Vínculo", icon: LuSlidersHorizontal },
    { path: "files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
  ],

  professional: [
    {
      path: "starts",
      text: "Início",
      icon: LuLayoutDashboard,
      summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
      path: "doctor/pendings",
      text: "Minhas Pendências",
      icon: HiOutlineExclamationCircle,
      summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
    },
    { path: "myRequests", text: "Minhas Solicitações", icon: LuMousePointerClick },
    { path: "professional/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
    { path: "schedule-sample", text: "Agendar Retirada da Amostra", icon: LuTestTube },
    { path: "professional/link-management", text: "Meus vínculos", icon: LuSlidersHorizontal },
    { path: "files", text: "Biblioteca de conteúdos", icon: LuFolderOpen },
  ],

  operation: [
    {
      path: "starts",
      text: "Início",
      icon: LuLayoutDashboard,
      summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
      path: "operation/pendings",
      text: "Minhas Pendências",
      icon: HiOutlineExclamationCircle,
      summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
    },
    { path: "operation/manage-files", text: "Gerenciar arquivos", icon: LuFiles, openModal: true },
    { path: "myRequests", text: "Acompanhar Solicitações", icon: LuMousePointerClick },
    { path: "operation/blocked-users", text: "Usuários bloqueados", icon: LuUserX },
    { path: "stock", text: "Estoque", icon: FaBoxArchive },
  ],

  logistics: [
    {
      path: "starts",
      text: "Início",
      icon: LuLayoutDashboard,
      summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
      path: "logistics/pendings",
      text: "Minhas Pendências",
      icon: HiOutlineExclamationCircle,
      summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
    },
    { path: "stock", text: "Estoque", icon: FaBoxArchive },
    { path: "myRequests", text: "Todas as solicitações", icon: LuMousePointerClick },
  ],

  client: [
    {
      path: "starts",
      text: "Início",
      icon: LuLayoutDashboard,
      summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
      path: "client/report",
      text: "Relatórios",
      icon: LuLineChart,
      summary: "Aqui você encontra tudo referente aos relatórios do programa.",
    },
  ],
};

/**
 * OVERRIDES POR PROGRAMA
 * Quando tiver as rotas do Onco prontas, colocar aqui, pois será aqui que vai sobrescrever as rotas bases que são referentes a neurologia.
 */
const oncologiaOverrides: Partial<RoleRoutes> = {
  logistics: [
    {
      path: "starts",
      text: "Início",
      icon: LuLayoutDashboard,
      summary: "Aqui você encontra tudo o que precisa para gerenciar suas solicitações de forma mais rápida e intuitiva.",
    },
    {
      path: "logistics/pendings",
      text: "Minhas Pendências",
      icon: HiOutlineExclamationCircle,
      summary: "Aqui você pode visualizar e gerenciar todas as pendências, acompanhar o status e tomar as ações necessárias para cada uma.",
    },
    { path: "myRequests", text: "Todas as solicitações", icon: LuMousePointerClick },
  ],
};

/**
 * ROTAS FINAIS POR PROGRAMA
 * Caso onco tenha as mesmas rotas que neuro, utilize baseRoutes apenas, mas se vier a ter rotas a mais ou a menos, utilize o override.
 */
export const routesByProgram: Record<ProgramSlug, RoleRoutes> = {
  neurologia: baseRoutes,
  oncologia: {
    ...baseRoutes,
    ...oncologiaOverrides,
  },
};