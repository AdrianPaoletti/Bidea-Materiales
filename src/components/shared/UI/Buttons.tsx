import React from "react";
import { useTranslation } from "react-i18next";

import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClickHandler?: Function;
  isDisabled?: boolean;
  padding?: string;
  width?: string;
  color?: "primary" | "secondary";
}

const COLOR_DEFAULT = "primary";

export function ContainedButton({
  onClickHandler,
  icon,
  label,
  isDisabled,
}: ButtonProps) {
  const { t } = useTranslation(["cta"]);
  return (
    <Button
      variant="contained"
      color={COLOR_DEFAULT}
      type="button"
      onClick={() => (onClickHandler ? onClickHandler() : void 0)}
      startIcon={icon}
      size="small"
      disabled={isDisabled}
    >
      {t(`cta:${label}`)}
    </Button>
  );
}

export function TextButton({
  onClickHandler,
  icon,
  label,
  padding = "",
}: ButtonProps) {
  const { t } = useTranslation(["cta"]);
  return (
    <Button
      variant="text"
      color={COLOR_DEFAULT}
      type="button"
      onClick={() => (onClickHandler ? onClickHandler() : void 0)}
      startIcon={icon}
      size="small"
      sx={{ padding }}
    >
      {t(`cta:${label}`)}
    </Button>
  );
}

export function SubmitButton({
  icon,
  label,
  isDisabled = false,
  padding = "",
  width = "auto",
  color = COLOR_DEFAULT,
}: ButtonProps) {
  const { t } = useTranslation(["cta"]);
  return (
    <Button
      variant="contained"
      color={color}
      sx={{ padding, minWidth: width }}
      type="submit"
      startIcon={icon}
      disabled={isDisabled}
      size="small"
    >
      {t(`cta:${label}`)}
    </Button>
  );
}

interface LoadingButtonProps {
  label: string;
  isLoading: boolean;
  icon?: React.ReactNode;
  isDisabled?: boolean;
}
export function CLoadingButton({
  icon,
  label,
  isDisabled = false,
  isLoading,
}: LoadingButtonProps) {
  const { t } = useTranslation(["cta"]);
  return (
    <LoadingButton
      variant="contained"
      color={COLOR_DEFAULT}
      type="submit"
      disabled={isDisabled}
      loading={isLoading}
      loadingPosition="start"
      startIcon={icon}
    >
      {t(`cta:${label}`)}
    </LoadingButton>
  );
}
