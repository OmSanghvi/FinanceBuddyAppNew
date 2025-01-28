"use client"

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

/**
 * Props for the Select component.
 *
 * @typedef {Object} Props
 * @property {function} onChange - Function to handle the change event.
 * @property {function} onCreate - Function to handle the creation of a new option.
 * @property {Object[]} [options] - Array of options for the select component.
 * @property {string} options.label - The label of the option.
 * @property {string} options.value - The value of the option.
 * @property {string|null|undefined} [value] - The selected value.
 * @property {boolean} [disabled] - Indicates if the select component is disabled.
 * @property {string} [placeholder] - Placeholder text for the select component.
 */
type Props = {
    onChange: (value?: string) => void;
    onCreate: (value: string) => void;
    options?: { label: string; value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
};

/**
 * Select component for rendering a creatable select input.
 *
 * This component uses the react-select library to render a creatable select input.
 * It allows users to select from predefined options or create new ones.
 *
 * @param {Props} props - The properties for the Select component.
 * @returns {JSX.Element} The rendered Select component.
 */
export const Select = ({
                           value,
                           onChange,
                           disabled,
                           onCreate,
                           options = [],
                           placeholder
                       }: Props) => {
    const onSelect = (
        option: SingleValue<{ label: string; value: string }>
    ) => {
        onChange(option?.value);
    };

    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);

    return (
        <CreateableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                control: (base) => ({
                    ...base,
                    borderColor: "#e2e8f0",
                    ":hover": {
                        borderColor: "#e2e8f0",
                    }
                })
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    );
};