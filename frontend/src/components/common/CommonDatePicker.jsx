import React from "react";
import { TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const CustomDatePicker = ({
    name,
    value,
    readOnly = false,
    onChange,
    required = false,
    placeholder = "Select Date/Time",
    minDate,
    maxDate,
    isTimePicker = false,
    className = "form-control"
}) => {
    const handleChange = (newValue) => {
        if (!newValue) {
            onChange({ target: { name, value: "" } });
            return;
        }

        const formattedValue = isTimePicker 
            ? newValue.format("HH:mm")
            : newValue.format("YYYY-MM-DD");

        onChange({
            target: { 
                name,
                value: formattedValue
            }
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isTimePicker ? (
                <TimePicker
                    label={placeholder}
                    value={value ? dayjs(`1970-01-01T${value}`) : null}
                    onChange={handleChange}
                    readOnly={readOnly}
                    renderInput={(params) => <TextField {...params} required={required} className={className} />}
                />
            ) : (
                <DatePicker
                    label={placeholder}
                    value={value ? dayjs(value) : null}
                    onChange={handleChange}
                    readOnly={readOnly}
                    minDate={minDate ? dayjs(minDate) : undefined}
                    maxDate={maxDate ? dayjs(maxDate) : undefined}
                    renderInput={(params) => <TextField {...params} required={required} className={className} />}
                />
            )}
        </LocalizationProvider>
    );
};

export default CustomDatePicker;
