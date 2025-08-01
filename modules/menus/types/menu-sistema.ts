import { RolUsuario } from "@/enum/user-roles";

export interface Menu {
  id: string;
  title: string;
  path: string;
  order: number;
  icon?: string;
  visible: boolean;
  areaId: string;
  rolesAllowed?: RolUsuario[];
  subMenus?: SubMenu[];
}

export interface SubMenu {
  id: string;
  title: string;
  path: string;
  order: number;
  visible: boolean;
  areaId: string;
  rolesAllowed?: RolUsuario[];
}