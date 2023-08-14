import { useTranslation } from "react-i18next";

import { NewBarcodeDTO } from "@ikusi/resources-management-api-typescript-fetch";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ChangeEventDatePicker } from "../FiltersHeader/ScanMaterials/scan-materials.model";

interface DateCalendarPickerProps {
  handleChange: (
    event: ChangeEventDatePicker | null,
    id: keyof NewBarcodeDTO | string
  ) => void;
  handleDelete: (id: string) => void;
  id: keyof NewBarcodeDTO | string;
  label: string;
  value: ChangeEventDatePicker | null;
  isPastDisabled?: boolean;
  minDate?: ChangeEventDatePicker;
  helperText?: string;
}

const DateCalendarPicker = ({
  handleChange,
  handleDelete,
  id,
  label,
  isPastDisabled = false,
  minDate,
  helperText,
  value,
}: DateCalendarPickerProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <LocalizationProvider
      key={id}
      dateAdapter={AdapterDayjs}
      adapterLocale={"es"}
    >
      <DatePicker
        disablePast={isPastDisabled}
        minDate={minDate}
        label={t(`common:${label}`)}
        onChange={(event: ChangeEventDatePicker | null) =>
          handleChange(event, id)
        }
        value={value}
        slotProps={{
          textField: {
            id,
            onKeyDown: (event) => event.preventDefault(),
            focused: true,
            helperText: helperText,
            InputProps: {
              sx: {
                padding: "0 2rem",
              },
              startAdornment: value && (
                <IconButton
                  sx={{ position: "absolute", right: "3.75rem" }}
                  onClick={() => handleDelete(id)}
                >
                  <ClearIcon />
                </IconButton>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateCalendarPicker;
