import React, { ChangeEventHandler, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

interface TextInputProps {
  label: ReactNode;
  error?: boolean;
  helperText?: ReactNode;
  changeHandler?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  icon?: ReactNode;
  name?: string;
}

export default function TextSearchField({
  label,
  error,
  helperText,
  changeHandler,
  icon,
  name,
}: TextInputProps) {
  const { t } = useTranslation(["common", "errors"]);

  return (
    <TextField
      label={t(`common:${label}`)}
      color="primary"
      onChange={changeHandler}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <div className="u-icon-font-size">
              {icon || <SearchIcon fontSize="inherit" color="inherit" />}
            </div>
          </InputAdornment>
        ),
        sx: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
          },
        },
      }}
      name={name}
      error={error}
      helperText={t(`errors:${helperText || ""}`)}
      focused
      fullWidth
    />
  );
}
