import { TElement } from "./TElement";
import { TPermissionElements } from "./TPermissionItems";
import { TUser } from "./TUser";

export type TGroup = {
    id: string,
    name: string,
    parent_group?: TGroup | null,
    users?: TUser[],   
    permissions?: TPermissionElements 
};