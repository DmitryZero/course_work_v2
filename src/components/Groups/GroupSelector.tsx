import { Autocomplete, Box, Checkbox, SelectChangeEvent, TextField } from "@mui/material";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useGroupStore } from "./GroupStore";
import { TGroup } from "../../interfaces/TGroup";

type TProps = {
    field_name: string,
    is_read_only?: boolean,
    value_id?: string | null,
    variants: TGroup[],
    setValue?: (group: TGroup | null, field_name?: string) => void
}

export default function GroupSelector({ field_name, is_read_only, setValue, value_id, variants}: TProps) {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Autocomplete
            options={variants}
            value={variants.find(i => i.id === value_id) || null}
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
                if (setValue) setValue(newValue, field_name)
            }}
            sx={{ mt: 2 }}
            readOnly={is_read_only}
            disabled={is_read_only}
        />
    );
}