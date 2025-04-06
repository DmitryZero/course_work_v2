import { Autocomplete, Box, Checkbox, SelectChangeEvent, TextField } from "@mui/material";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useGroupStore } from "./GroupStore";
import { TGroup } from "../../interfaces/TGroup";

type TProps = {
    field_name: string,
    is_read_only?: boolean,
    initial_group?: TGroup
    chooseGroup: (group: TGroup) => void
}

export default function GroupSelector({ field_name, is_read_only, initial_group, chooseGroup }: TProps) {
    const groups = useGroupStore(state => state.groups);
    const [current_group, setCurrentGroup] = useState<TGroup | null>(groups.find(g => g.id === initial_group?.id) || null);

    const handleChange = (event: SelectChangeEvent) => {
        const selected_group = groups.find(g => g.id === (event.target.value as string));
        setCurrentGroup(selected_group || null);
        chooseGroup(selected_group!)
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Autocomplete
            options={groups}
            value={current_group}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </li>
                );
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} label={field_name} />
            )}
            onChange={(event: any, newValue: TGroup | null) => {
                setCurrentGroup(newValue);
            }}
            sx={{ mt: 2 }}
            readOnly={is_read_only}
            disabled={is_read_only}
        />
    );
}