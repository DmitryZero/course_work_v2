import { TUser } from "./TUser";

export type TGroup = {
    id: string,
    name: string,
    parent_group?: TGroup,
    users?: TUser[]
};