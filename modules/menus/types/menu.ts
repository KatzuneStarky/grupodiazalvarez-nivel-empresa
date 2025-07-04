export interface BaseMenu {
  id: string;
  name: string;
  icon: string;
  areaId?: string;
  link: string;
  orden: number;
  //allowedRoles: AllowedRoles[];
}

export interface AreaMenu extends BaseMenu {
  subMenus?: AreaSubMenu[];
}

export type AreaSubMenu = Omit<BaseMenu, 'areaId'> & {
  menuId: string;
};