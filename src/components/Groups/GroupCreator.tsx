import { useState } from "react";
import { useUserStore } from "../Users/UserStore";
import { TGroup } from "../../interfaces/TGroup";
import { Button, FormGroup, Paper, TextField } from "@mui/material";
import GroupSelector from "./GroupSelector";
import UserSelector from "../Users/UserSelector";

export default function GroupCreator() {
    const [group, setGroup] = useState<TGroup>({
        id: "",
        name: "",
        parent_group: undefined,
        users: []
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setGroup({ ...group, [e.target.name]: e.target.value });
    }

    function handleCreate() {
        // setCurrentItems({ ...current_items,  });
    }

    return (
        <>
            <Paper className="p-4">
                <h2 className="font-semibold">Создать новую группу</h2>
                <TextField
                    label="Название группы"
                    name="name"
                    value={group.name}
                    fullWidth
                    sx={{ mt: 2 }}
                    onChange={handleChange}
                />
                <FormGroup sx={{ mt: 2, "& > *": { mt: 2 } }}>
                    <GroupSelector field_name="Родитель" chooseGroup={(g) => g} />
                </FormGroup>
                <UserSelector />
                <Button sx={{ mt: 2 }} onClick={handleCreate} variant="contained" color="primary">
                    Создать
                </Button>
            </Paper>
        </>
    );
}