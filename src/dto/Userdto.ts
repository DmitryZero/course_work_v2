import { IBaseNode } from "../interfaces/IBase";
import { TResponse } from "../interfaces/TResponse";
import { TUser } from "../interfaces/TUser";

interface IUserDB extends IBaseNode {
    is_admin: boolean,
    full_name: string
} 

export default function UserDto(input_data: any) {
    const data: TResponse<IUserDB> = input_data;
    const users_obj = data.result.map(i => <TUser>{
        id: i["@rid"],
        name: i.full_name,
        is_admin: i.is_admin
    })

    return users_obj;
}