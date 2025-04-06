import { useState } from "react";
import { TElement } from "../../interfaces/TElement";
import { useElementStore } from "./ElementStore";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, Checkbox, TextField } from "@mui/material";

type TProps = {
    default_elements?: TElement[] | undefined
    // updateElementList: Act<TElement[]>
}

export default function ElementSelector({ default_elements }: TProps) {
    const elements = useElementStore(state => state.elements);
    const [selected_elements, setSelectedElements] = useState<TElement[]>(default_elements || []);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <Autocomplete
            multiple
            options={elements}
            value={selected_elements}
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
                <TextField {...params} label="Элементы" />
            )}
            onChange={(event: any, newValue: TElement[] | null) => {
                setSelectedElements(newValue || []);
            }}
            sx={{ mt: 2 }}
        />
    );
}