import { createElement } from "react";
import { dbController } from "../components/dbController/dbController";
import Elementdto from "../dto/Elementdto";
import { TElement } from "../interfaces/TElement";

type TGroupPermissions = {
    groupId: string,
    permissions: {
        read: boolean,
        write: boolean,
        delete: boolean
    }
};

export const ElementController = {
    async getElements() {
        const elements_db_data = await dbController.sendSQLRequest("SELECT *, (SELECT expand(inE()) FROM $current) as IN_EDGES, (SELECT expand(outE()) FROM $current) as OUT_EDGES FROM Element");
        return Elementdto(elements_db_data);
    },

    async createElement(element: TElement) {
        const requests: string[] = [
            `LET new_element = CREATE VERTEX Element SET name = '${element.name}', description = '${element.description}'`
        ];

        if (element.permissions) {
            const final_permissions: TGroupPermissions[] = [];

            const groups_ids = [...element.permissions.read_ids || [], ...element.permissions.write_ids || [], ...element.permissions.delete_ids || []].flat();
            const unique_groups_ids = Array.from(new Set(groups_ids));
            unique_groups_ids.forEach(g => {
                const current_permissions: TGroupPermissions = {
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

    async updateElement(element: TElement, edges_to_delete: { read: string[], write: string[], delete: string[] }, edges_to_update: { read: string[], write: string[], delete: string[] }) {
        const requests: string[] = [
            `LET updated_element = SELECT FROM Element Where @rid='${element.id}'`
        ];

        if (edges_to_delete) 

        if (element.permissions) {
            const final_permissions: TGroupPermissions[] = [];

            const groups_ids = [...element.permissions.read_ids || [], ...element.permissions.write_ids || [], ...element.permissions.delete_ids || []].flat();
            const unique_groups_ids = Array.from(new Set(groups_ids));
            unique_groups_ids.forEach(g => {
                const current_permissions: TGroupPermissions = {
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

            final_permissions.forEach((p, index) => {
                requests.push(`LET group${index} = SELECT FROM Group Where @rid='${p.groupId}'`);
                requests.push(`CREATE EDGE HAS_PERMISSION FROM $group${index} TO $new_element SET is_read=${p.permissions.read}, is_write=${p.permissions.write}, is_delete=${p.permissions.delete}`);
            });
        }

        requests.push("return $new_element");
        console.log("request", requests);

        const updated_element = await dbController.batchSQLRequest(requests);
        return Elementdto(updated_element);
    }
}