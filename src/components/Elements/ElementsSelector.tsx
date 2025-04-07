import { useState } from "react";
import { TElement } from "../../interfaces/TElement";
import { useElementStore } from "./ElementStore";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, Checkbox, TextField } from "@mui/material";

type TProps = {
    value?: TElement[] | null,
    variants: TElement[],
    setCurrentValue: (new_value: TElement[] | null, field_name?: string) => void,
    fieldName: string
}

export default function ElementSelector({ value, variants, fieldName, setCurrentValue }: TProps) {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Autocomplete
            multiple            
            options={variants}
            value={value || []}
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
                <TextField {...params} label={fieldName} />
            )}
            onChange={(event: any, newValue: TElement[] | null) => {
                setCurrentValue(newValue || [], fieldName);
            }}
            sx={{ mt: 2 }}
        />
    );
}