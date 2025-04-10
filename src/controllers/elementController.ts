import { createElement } from "react";
import { dbController } from "../components/dbController/dbController";
import Elementdto from "../dto/Elementdto";
import { TElement } from "../interfaces/TElement";
import { TPermissionGroups } from "../interfaces/TPermissionGroups";
import { TResponse } from "../interfaces/TResponse";
import { IBaseEdge, IExtendedEdge } from "../interfaces/IBase";
import { useUserStore } from "../components/Users/UserStore";

type TPermissionsByGroup = {
    groupId: string,
    permissions: {
        read: boolean,
        write: boolean,
        delete: boolean
    }
};

interface IEdgeData {
    is_read: boolean,
    is_write: boolean,
    is_delete: boolean,
}

interface IElementsRights {
    "in": string,
    "out": string,
    "is_read": boolean,
    "is_write": boolean,
    "is_delete": boolean
}

export const ElementController = {
    async getElements() {
        if (useUserStore.getState().currentUser?.is_admin) {
            const elements_db_data = await dbController.sendSQLRequest(`SELECT *, (SELECT expand(inE()) FROM $current) as IN_EDGES, (SELECT expand(outE()) FROM $current) as OUT_EDGES FROM Element`);
            const elements = Elementdto(elements_db_data)
            return {
                elements: elements,
                items_to_write: elements.map(i => i.id),
                items_to_delete: elements.map(i => i.id)
            }
        }

        const elements_rights: TResponse<IElementsRights> = await dbController.sendSQLRequest(`SELECT in, out, is_read, is_write, is_delete FROM (SELECT expand(outE('HAS_PERMISSION')) FROM (TRAVERSE out('BELONGS_TO') FROM (SELECT expand(out('MEMBER_OF')) FROM User WHERE @rid = '${useUserStore.getState().currentUser?.id}') WHILE $depth <= 10))`);

        const unique_elements_rights: IElementsRights[] = [];
        elements_rights.result.forEach(i => {
            const existing_value_index = unique_elements_rights.findIndex(j => j.in === i.in);
            if (existing_value_index === -1) {
                unique_elements_rights.push(i)
                return;
            }

            unique_elements_rights[existing_value_index].is_read = unique_elements_rights[existing_value_index].is_read || i.is_read;
            unique_elements_rights[existing_value_index].is_write = unique_elements_rights[existing_value_index].is_write || i.is_write;
            unique_elements_rights[existing_value_index].is_delete = unique_elements_rights[existing_value_index].is_delete || i.is_delete;
        });
        console.log("unique_elements_rights", unique_elements_rights);

        const elements_db_data = await dbController.sendSQLRequest(`SELECT *, (SELECT expand(inE()) FROM $current) as IN_EDGES, (SELECT expand(outE()) FROM $current) as OUT_EDGES FROM Element WHERE @rid IN [${elements_rights.result.map(i => i.in)}]`);
        const elements = Elementdto(elements_db_data);

        const items_to_read: string[] = [];
        const items_to_delete: string[] = [];
        const items_to_write: string[] = [];

        elements.forEach(e => {
            const permission = unique_elements_rights.find(u => u.in === e.id);
            if (permission) {
                if (permission.is_read) items_to_read.push(permission.in);
                if (permission.is_write) items_to_write.push(permission.in);
                if (permission.is_delete) items_to_delete.push(permission.in);
            }
        })

        return {
            elements: elements.filter(e => items_to_read.includes(e.id)),
            items_to_write: items_to_write,
            items_to_delete: items_to_delete
        }
    },


    async createElement(element: TElement) {
        const requests: string[] = [
            `LET new_element = CREATE VERTEX Element SET name = '${element.name}', description = '${element.description}'`
        ];

        if (element.permissions) {
            const final_permissions = transformPermission(element);

            final_permissions.forEach((p, index) => {
                requests.push(`LET group${index} = SELECT FROM Group Where @rid='${p.groupId}'`);
                requests.push(`CREATE EDGE HAS_PERMISSION FROM $group${index} TO $new_element SET is_read=${p.permissions.read}, is_write=${p.permissions.write}, is_delete=${p.permissions.delete}`);
            });
        }

        requests.push("return $new_element");
        console.log("request", requests);

        const updated_element = await dbController.batchSQLRequest(requests);
        return Elementdto(updated_element);
    },

    async updateElement(element: TElement) {
        const requests: string[] = [
            `UPDATE Element SET name='${element.name}', description='${element.description}' Where @rid='${element.id}'`,
            `LET updated_element = SELECT * FROM Element Where @rid='${element.id}'`,
            `DELETE EDGE HAS_PERMISSION WHERE in = '${element.id}'`,
        ];

        console.log("element", element);
        if (element.permissions) {
            const final_permissions = transformPermission(element);

            final_permissions.forEach((p, index) => {
                requests.push(`LET group${index} = SELECT FROM Group Where @rid='${p.groupId}'`);
                requests.push(`CREATE EDGE HAS_PERMISSION FROM $group${index} TO $updated_element SET is_read=${p.permissions.read}, is_write=${p.permissions.write}, is_delete=${p.permissions.delete}`);
            });
        }

        console.log("request", requests);

        const resp = await dbController.batchSQLRequest(requests);
        console.log("update resp", resp);
        return;
    },

    async deleteElement(element: TElement) {
        const delete_req = await dbController.sendSQLRequest(`DELETE VERTEX FROM Element WHERE @rid='${element.id}'`);
        console.log("delete_req", delete_req);
    }
}

function transformPermission(element: TElement) {
    const final_permissions: TPermissionsByGroup[] = [];

    const groups_ids = [...element.permissions!.read_ids || [], ...element.permissions!.write_ids || [], ...element.permissions!.delete_ids || []].flat();
    const unique_groups_ids = Array.from(new Set(groups_ids));
    unique_groups_ids.forEach(g => {
        const current_permissions: TPermissionsByGroup = {
            groupId: g,
            permissions: {
                read: false,
                write: false,
                delete: false
            }
        }

        current_permissions.permissions.read = element.permissions?.read_ids?.some(i => i === g) === true;
        current_permissions.permissions.write = element.permissions?.write_ids?.some(i => i === g) === true;
        current_permissions.permissions.delete = element.permissions?.delete_ids?.some(i => i === g) === true;
        final_permissions.push(current_permissions);
    })

    return final_permissions;
}