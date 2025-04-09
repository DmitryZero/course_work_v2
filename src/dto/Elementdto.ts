import { useGroupStore } from "../components/Groups/GroupStore";
import { useUserStore } from "../components/Users/UserStore";
import { IBaseNode } from "../interfaces/IBase";
import { TElement } from "../interfaces/TElement";
import { TResponse } from "../interfaces/TResponse";

interface IEdgeData {
    is_read: boolean,
    is_write: boolean,
    is_delete: boolean,
} 

interface IElementDBNode extends IBaseNode<IEdgeData> {
    name: string,
    description: string;
}

export default function Elementdto(input_data: any) {
    const data: TResponse<IElementDBNode> = input_data;
    const obj = data.result.map(i => <TElement>{
        id: i["@rid"],
        name: i.name,
        description: i.description,
        permissions: {
            read_ids: i.IN_EDGES?.filter(e => e["@class"] === "HAS_PERMISSION" && e.is_read)?.map(i => i.out),
            write_ids: i.IN_EDGES?.filter(e => e["@class"] === "HAS_PERMISSION" && e.is_write)?.map(i => i.out),
            delete_ids: i.IN_EDGES?.filter(e => e["@class"] === "HAS_PERMISSION" && e.is_delete)?.map(i => i.out)
        }
    })
    console.log(obj);
 
    return obj;
}