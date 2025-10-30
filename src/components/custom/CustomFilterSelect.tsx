"use client";

import React, { useState } from 'react';
import Select from 'react-select';
import { InputLoading } from './InputLoading';
import { IStringMap } from '@/types';

interface CustomFilterSelectProps {
    name: string;
    options: IStringMap[];
    label?: React.ReactNode;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    customClass?: string;
    isLoading?: boolean;
    params?: any;
    placeholder?: string;
    disabled?: boolean;
}

const CustomFilterSelect: React.FC<CustomFilterSelectProps> = ({
    name,
    label,
    options,
    value,
    onChange,
    onBlur,
    customClass,
    isLoading,
    params,
    placeholder = "Selecione...",
    disabled = false,
    ...props
}) => {
    const [filter, setFilter] = useState("");

    if (isLoading) return <InputLoading />;

    const filteredOptions = Array.isArray(options) && options.length > 0
        ? options
            .filter(option => option.optionName && option.optionName.toLowerCase().includes(filter.toLowerCase()))
            .map(option => ({
                value: option.stringMapId,
                label: option.optionName,
            }))
        : [];

    return (
        <div className={`relative w-full ${customClass}`}>
            {label && (
                <label className="block mb-1 text-base tracking-wide text-black">
                    {label}
                </label>
            )}

            <div className="relative">
                <Select
                    name={name}
                    value={value ? { value, label: options.find(opt => opt.stringMapId === value)?.optionName } : null}
                    onChange={(selectedOption) => {
                        if (onChange && selectedOption) {
                            onChange(selectedOption.value);
                        }
                    }}
                    onBlur={onBlur}
                    options={filteredOptions}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            height: '52px',
                            minHeight: '52px',
                            borderRadius: '0.375rem',
                            borderColor: '#c4b9b9',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            backgroundColor: disabled ? '#e7e5e4' : 'white',
                            cursor: disabled ? 'not-allowed' : 'default',
                        }),
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                        }),
                        menuList: (provided) => ({
                            ...provided,
                            maxHeight: '300px',
                            overflowY: 'auto',
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: disabled ? '#000000' : '#919191',
                            fontWeight: disabled ? 'bold' : 'normal',
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: disabled ? '#000000' : 'inherit',
                            fontWeight: disabled ? 'bold' : 'normal',
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            padding: '1rem',
                            backgroundColor: state.isSelected ? '#f3f4f6' : 'white',
                            color: state.isSelected ? '#1f2937' : '#4a5568',
                        }),
                    }}
                    {...props}
                    isDisabled={disabled}
                />
            </div>
        </div>
    );
};

export { CustomFilterSelect };
