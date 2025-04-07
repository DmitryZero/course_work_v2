import { useState } from "react";
import { TGroup } from "../../interfaces/TGroup";
import { Button, Collapse, IconButton, Paper, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UserSelector from "../Users/UserSelector";
import GroupSelector from "./GroupSelector";
import ElementList from "../Elements/ElementList";
import ElementSelector from "../Elements/ElementsSelector";
import { useUserStore } from "../Users/UserStore";
import { useGroupStore } from "./GroupStore";
import { useElementStore } from "../Elements/ElementStore";
import { TElement } from "../../interfaces/TElement";
import { TPermissionElements } from "../../interfaces/TPermissionItems";
import { TUser } from "../../interfaces/TUser";

type TProps = {
    all_users: TUser[],
    all_groups: TGroup[],
    all_elements: TElement[]
    group: TGroup,
    updateGroup?: (update_item: TGroup) => void,
    deleteGroup?: (item_to_delete: TGroup) => void,
}

export default function GroupItem({ all_users, all_elements, all_groups, group, updateGroup, deleteGroup }: TProps) {
    const [is_open, setOpenGroup] = useState<boolean>(false);

    const [currrent_group, setCurrentGroup] = useState<TGroup>(group);
    const [current_permissions, setPermission] = useState<TPermissionElements>(currrent_group.permissions || {
        read: null,
        write: null,
        delete: null
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentGroup({ ...currrent_group, [e.target.name]: e.target.value });
    }

    function handleParentGroupsChange(group: TGroup | null, field_name?: string) {
        setCurrentGroup({ ...currrent_group, parent_group: group });
    }

    function handleElementsChange(new_value: TElement[] | null, field_name?: string) {
        if (field_name === "Чтение") setPermission({ ...current_permissions, read: new_value });
        else if (field_name === "Редактирование") setPermission({ ...current_permissions, write: new_value });
        else setPermission({ ...current_permissions, delete: new_value });
    }

    const handleUpdate = () => {
        if (updateGroup) updateGroup({ ...currrent_group, permissions: current_permissions });
    }

    const handleDelete = () => {
        if (deleteGroup) deleteGroup(currrent_group)
    }

    return (
        <>
            <Paper className="p-4 mt-2">
                <h3 className="font-semibold">
                    {currrent_group.name}
                    <Button
                        sx={{ ml: 2 }}
                        size="small"
                        onClick={() => setOpenGroup(!is_open)}
                    >
                        {is_open ? "Скрыть" : "Развернуть"}
                    </Button>
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </h3>

                <Collapse in={is_open}>
                    <TextField
                        label="Название группы"
                        name="name"
                        value={currrent_group.name}
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={handleChange}
                    />
                    <UserSelector value={group.users} variants={all_users} />
                    <GroupSelector value={group.parent_group} variants={all_groups} field_name="Родитель" setValue={handleParentGroupsChange} />
                    <div>
                        <ElementSelector value={current_permissions.read} fieldName="Чтение" variants={all_elements} setCurrentValue={handleElementsChange} />
                        <ElementSelector value={current_permissions.write} fieldName="Редактирование" variants={all_elements} setCurrentValue={handleElementsChange} />
                        <ElementSelector value={current_permissions.delete} fieldName="Удаление" variants={all_elements} setCurrentValue={handleElementsChange} />
                    </div>
                    <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleUpdate}>
                        Обновить
                    </Button>
                </Collapse>
            </Paper>
        </>
    );
}