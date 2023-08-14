import { useTranslation } from "react-i18next";

import { NewBarcodeDTO } from "@ikusi/resources-management-api-typescript-fetch";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import { ReportQueryFilters } from "resources-management/core/models/report-query-filters.model";

interface OutlinedInputsProps {
  id: keyof NewBarcodeDTO | keyof ReportQueryFilters;
  label: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  keyDown?: (event: React.KeyboardEvent) => void;
  refElement?: React.MutableRefObject<HTMLInputElement | null>;
  icon?: JSX.Element;
  value?: NewBarcodeDTO;
}

const OutlinedInputs = ({
  id,
  label,
  keyDown,
  refElement,
  icon,
  value,
  handleChange,
}: OutlinedInputsProps) => {
  const { t } = useTranslation(["common"]);
  const numberTypeIds = ["price", "interventionRequestCode"];

  return (
    <FormControl focused>
      <InputLabel>{t(`common:${label}`)}</InputLabel>
      <OutlinedInput
        label={t(`common:${label}`)}
        ref={keyDown && refElement}
        id={id}
        type={numberTypeIds.includes(id) ? "number" : "text"}
        onKeyDown={keyDown}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(event)
        }
        value={keyDown && value?.[id as keyof NewBarcodeDTO]}
        slotProps={{ input: { step: "any" } }}
        startAdornment={
          keyDown && (
            <InputAdornment position="start">
              <div className="u-icon-font-size">
                {icon || (
                  <QrCodeScannerIcon fontSize="inherit" color="inherit" />
                )}
              </div>
            </InputAdornment>
          )
        }
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: keyDown ? "2px" : "1px",
          },
          input: { paddingLeft: keyDown ? "0.5rem" : "2rem" },
        }}
      />
    </FormControl>
  );
};

export default OutlinedInputs;
