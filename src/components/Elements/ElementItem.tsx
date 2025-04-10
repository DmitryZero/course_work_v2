import DeleteIcon from '@mui/icons-material/Delete';
import { TElement } from '../../interfaces/TElement';
import { useEffect, useState } from 'react';
import { TGroup } from '../../interfaces/TGroup';
import { Button, Collapse, FormGroup, IconButton, Paper, TextField } from '@mui/material';
import GroupSelector from '../Groups/GroupSelector';
import { TPermissionGroups } from '../../interfaces/TPermissionGroups';
import MultipleGroupSelector from '../Groups/MultipleGroupSelector';
import { useUserStore } from '../Users/UserStore';

type TProps = {
    element: TElement,
    is_readonly?: boolean
    groups?: TGroup[],
    updateItem?: (update_item: TElement) => void
    deleteElement?: (item_to_delete: TElement) => void,
}

export default function ElementItem({ element, is_readonly, groups, updateItem, deleteElement }: TProps) {
    const [is_open, setOpenElements] = useState<boolean>(false);
    const items_to_write_ids = useUserStore(state => state.element_to_update);
    const items_to_delete_ids = useUserStore(state => state.element_to_delete);

    const toggleElement = (id: string) => {
        setOpenElements((prev) => !prev);
    };

    const [currrent_element, setCurrentElement] = useState<TElement>(element);
    const [current_permissions, setPermission] = useState<TPermissionGroups>(element.permissions || {
        read_ids: null,
        write_ids: null,
        delete_ids: null
    });

    useEffect(() => {
        setPermission(element.permissions || {
            read_ids: null,
            write_ids: null,
            delete_ids: null
        });
    }, [element.permissions]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentElement({ ...currrent_element, [e.target.name]: e.target.value });
    }

    const handlePermissionUpdate = (group: TGroup[] | null, field_name?: string) => {
        if (field_name === "Чтение") setPermission({ ...current_permissions, read_ids: group?.map(i => i.id) || null });
        else if (field_name === "Редактирование") setPermission({ ...current_permissions, write_ids: group?.map(i => i.id) || null });
        else setPermission({ ...current_permissions, delete_ids: group?.map(i => i.id) || null });
    }

    const handleUpdate = () => {
        if (updateItem) updateItem({ ...currrent_element, permissions: current_permissions });
    }

    const handleDelete = () => {
        console.log("handleDelete");
        if (deleteElement) deleteElement(currrent_element)
    }

    return (
        <>
            <Paper className="p-4" sx={{ mt: 2 }}>
                <h3 className="font-semibold">
                    {currrent_element.name}
                    <Button
                        sx={{ ml: 2 }}
                        size="small"
                        onClick={() => toggleElement(currrent_element.id)}
                    >
                        {is_open ? "Скрыть" : "Развернуть"}
                    </Button>
                    {
                        (items_to_delete_ids || []).includes(currrent_element.id) &&
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    }
                </h3>

                <Collapse in={is_open}>
                    <TextField
                        label="Название элемента"
                        name="name"
                        value={currrent_element.name}
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                readOnly: is_readonly,
                            },
                        }}
                        variant={is_readonly ? "filled" : "outlined"}
                    />
                    <TextField
                        label="Описание"
                        name="description"
                        value={currrent_element.description}
                        fullWidth
                        sx={{ mt: 2 }}
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                readOnly: is_readonly,
                            },
                        }}
                        variant={is_readonly ? "filled" : "outlined"}
                    />
                    <FormGroup sx={{ mt: 2, "& > *": { mt: 2 } }}>
                        <MultipleGroupSelector is_read_only={is_readonly} value_ids={current_permissions.read_ids} variants={groups || []} field_name="Чтение" setValue={handlePermissionUpdate} />
                        <MultipleGroupSelector is_read_only={is_readonly} value_ids={current_permissions.write_ids} variants={groups || []} field_name="Редактирование" setValue={handlePermissionUpdate} />
                        <MultipleGroupSelector is_read_only={is_readonly} value_ids={current_permissions.delete_ids} variants={groups || []} field_name="Удаление" setValue={handlePermissionUpdate} />
                    </FormGroup>
                    {
                        (items_to_write_ids || []).includes(currrent_element.id) &&
                        <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleUpdate}>
                            Обновить
                        </Button>
                    }
                </Collapse>
            </Paper>
        </>
    );
}