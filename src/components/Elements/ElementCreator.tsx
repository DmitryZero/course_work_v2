import { useState } from "react";
import { useGroupStore } from "../Groups/GroupStore";
import { TElement } from "../../interfaces/TElement";
import { TGroup } from "../../interfaces/TGroup";
import { Button, FormGroup, Paper, TextField } from "@mui/material";
import GroupSelector from "../Groups/GroupSelector";

export default function ElementCreator() {
    const groups = useGroupStore(state => state.groups);

    const [element, setElement] = useState<TElement>({
        id: "",
        name: "",
        description: "",
        permissions: {
            read: undefined,
            write: undefined,
            delete: undefined
        }
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setElement({ ...element, [e.target.name]: e.target.value });
    }

    function handlePermissionChange(permission: "read" | "write" | "delete", group: TGroup) {
        setElement((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: group
            },
        }));
    }

    function handleCreate() {
        // setCurrentItems({ ...current_items,  });
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
                onChange={handleChange}
            />
            <TextField
                label="Описание"
                name="description"
                value={element.description}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 2 }}
            />
            <FormGroup sx={{ mt: 2, "& > *": { mt: 2 } }}>
                <GroupSelector field_name="Чтение" chooseGroup={(g) => handlePermissionChange("read", g)} />
                <GroupSelector field_name="Редактирование" chooseGroup={(g) => handlePermissionChange("write", g)} />
                <GroupSelector field_name="Удаление" chooseGroup={(g) => handlePermissionChange("delete", g)} />
            </FormGroup>
            <Button sx={{ mt: 2 }} onClick={handleCreate} variant="contained" color="primary">
                Создать
            </Button>
        </Paper>
    );
}