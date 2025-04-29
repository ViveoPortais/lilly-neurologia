import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  LuFolderOpen,
  LuLayoutDashboard,
  LuMousePointerClick,
  LuSlidersHorizontal,
  LuTestTube,
  LuUserPlus,
} from "react-icons/lu";
import { IconType } from "react-icons/lib";

interface IProfileProps {
  route: string;
  text: string;
  icon: IconType;
}

interface IRouteProps {
  [key: string]: IProfileProps[];
}

export const routes: IRouteProps = {
  doctor: [
    { route: "/dashboard/starts", text: "Início", icon: LuLayoutDashboard },
    { route: "/dashboard/doctor/pendings", text: "Minhas Pendências", icon: HiOutlineExclamationCircle },
    { route: "/dashboard/doctor/requests", text: "Minhas Solicitações", icon: LuMousePointerClick },
    { route: "/dashboard/doctor/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
    { route: "/dashboard/doctor/sample-collection", text: "Agendar Retirada da Amostra", icon: LuTestTube },
    { route: "/dashboard/doctor/link-management", text: "Gerenciar Vínculo", icon: LuSlidersHorizontal },
    { route: "/dashboard/doctor/files", text: "Meus Arquivos", icon: LuFolderOpen },
  ],

  professional: [
    { route: "/dashboard/starts", text: "Início", icon: LuLayoutDashboard },
    { route: "/dashboard/operation/pendings", text: "Minhas Pendências", icon: HiOutlineExclamationCircle },
    { route: "/dashboard/operation/requests", text: "Minhas Solicitações", icon: LuMousePointerClick },
    { route: "/dashboard/operation/register-patient", text: "Cadastrar Pacientes", icon: LuUserPlus },
    { route: "/dashboard/operation/sample-collection", text: "Agendar Retirada da Amostra", icon: LuTestTube },
    { route: "/dashboard/operation/link-management", text: "Meus vínculos", icon: LuSlidersHorizontal },
    { route: "/dashboard/operation/files", text: "Meus Arquivos", icon: LuFolderOpen },
  ],
};
