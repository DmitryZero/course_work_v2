import { useState } from "react";
import { TGroup } from "../../interfaces/TGroup";
import { Button, FormGroup, Paper, TextField } from "@mui/material";
import GroupSelector from "./GroupSelector";
import UserSelector from "../Users/UserSelector";
import { useGroupStore } from "./GroupStore";
import { TUser } from "../../interfaces/TUser";
import { useUserStore } from "../Users/UserStore";

export default function GroupCreator() {
    const createGroup = useGroupStore(state => state.createGroup);
    const groups = useGroupStore(state => state.groups);
    const all_users = useUserStore(state => state.users);

    const [current_group, setCurrentGroup] = useState<TGroup>({
        id: "",
        name: "",
        parent_group_id: null,
        users_ids: []
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentGroup({ ...current_group, [e.target.name]: e.target.value });
    }

    function handleCreate() {
        createGroup(current_group);
        setCurrentGroup({
            id: "",
            name: "",
            parent_group_id: null,
            users_ids: []
        })
    }

    const handleUsersChange = (users: TUser[] | undefined) => {
        setCurrentGroup({ ...current_group, users_ids: (users || []).map(i => i.id) });
    }

    const handleGroupChange = (edited_group: TGroup | null, field_name?: string) => {
        setCurrentGroup({...current_group, parent_group_id: edited_group?.id});
    }

    return (
        <>
            <Paper className="p-4">
                <h2 className="font-semibold">Создать новую группу</h2>
                <TextField
                    label="Название группы"
                    name="name"
                    value={current_group.name}
                    fullWidth
                    sx={{ mt: 2 }}
                    onChange={handleChange}
                />
                <FormGroup sx={{ mt: 2, "& > *": { mt: 2 } }}>
                    <GroupSelector value_id={current_group.parent_group_id} variants={groups} setValue={handleGroupChange} field_name="Родитель" />
                </FormGroup>
                <UserSelector value_ids={current_group.users_ids} variants={all_users} updateValue={handleUsersChange} />
                <Button sx={{ mt: 2 }} onClick={handleCreate} variant="contained" color="primary">
                    Создать
                </Button>
            </Paper>
        </>
    );
}