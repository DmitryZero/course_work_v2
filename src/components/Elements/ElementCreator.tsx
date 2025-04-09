import { useState } from "react";
import { useGroupStore } from "../Groups/GroupStore";
import { TElement } from "../../interfaces/TElement";
import { TGroup } from "../../interfaces/TGroup";
import { Button, FormGroup, Paper, TextField } from "@mui/material";
import GroupSelector from "../Groups/GroupSelector";
import { useElementStore } from "./ElementStore";
import { TPermissionGroups } from "../../interfaces/TPermissionGroups";
import MultipleGroupSelector from "../Groups/MultipleGroupSelector";

export default function ElementCreator() {
    const groups = useGroupStore(state => state.groups);
    const createElement = useElementStore(state => state.createElement);

    const [element, setElement] = useState<TElement>({
        id: crypto.randomUUID(),
        name: "",
        description: ""
    });
    const [current_permissions, setPermission] = useState<TPermissionGroups>({
        read_ids: null,
        write_ids: null,
        delete_ids: null
    });

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElement({ ...element, [e.target.name]: e.target.value });
    }

    const handleCreate = () => {
        createElement({ ...element, permissions: current_permissions });
        setElement({
            id: crypto.randomUUID(),
            name: "",
            description: "",
        });
        setPermission({
            read_ids: null,
            write_ids: null,
            delete_ids: null
        });
    }

    const handlePermissionUpdate = (group: TGroup[] | null, field_name?: string) => {
        if (field_name === "Чтение") setPermission({...current_permissions, read_ids: group?.map(i => i.id) || null});
        else if (field_name === "Редактирование") setPermission({...current_permissions, write_ids: group?.map(i => i.id) || null});
        else setPermission({...current_permissions, delete_ids: group?.map(i => i.id) || null});
    }

    return (
        <Paper className="p-4">
            <h2 className="font-semibold">Создать новый элемент</h2>
            <TextField
                label="Название элемента"
                name="name"
                value={element.name}
                fullWidth
                sx={{ mt: 2 }}
                onChange={handleTextFieldChange}
            />
            <TextField
                label="Описание"
                name="description"
                value={element.description}
                onChange={handleTextFieldChange}
                fullWidth
                sx={{ mt: 2 }}
            />
            <FormGroup sx={{ mt: 2, "& > *": { mt: 2 } }}>
                <MultipleGroupSelector field_name="Чтение" value_ids={current_permissions.read_ids} variants={groups} setValue={handlePermissionUpdate} />
                <MultipleGroupSelector field_name="Редактирование" value_ids={current_permissions.write_ids} variants={groups} setValue={handlePermissionUpdate} />
                <MultipleGroupSelector field_name="Удаление" value_ids={current_permissions.delete_ids} variants={groups} setValue={handlePermissionUpdate} />
            </FormGroup>
            <Button sx={{ mt: 2 }} onClick={handleCreate} variant="contained" color="primary">
                Создать
            </Button>
        </Paper>
    );
}