import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";

import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";

const additionalIconStylesCellContent = (
  bookingTracking: BookingTrackingState[] | BookingTrackingIncidence[]
): IconContentCell[] => {
  return bookingTracking.map(({ id }) => {
    switch (id) {
      case "PLANNED":
        return {
          icon: <CachedIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.planned,
        };
      case "READY":
        return {
          icon: <SettingsOutlinedIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.ready,
        };
      case "MISSING_BARCODE_READING":
      case "MISSING_RESOURCE":
        return {
          icon: (
            <AddCircleOutlineOutlinedIcon fontSize="inherit" color="inherit" />
          ),
          color: colorPalette.icons.missingIdentification,
        };
      case "WAREHOUSE_DEVOLUTION":
        return {
          icon: <WarehouseOutlinedIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.done,
        };
      case "PRE_WAREHOUSE_DEVOLUTION":
        return {
          icon: <WarehouseOutlinedIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.preWarehouseDevolution,
        };
      case "CHARGED_TO_PATIENT":
        return {
          icon: <LockPersonIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.planned,
        };
      case "EXPIRED":
        return {
          icon: <ErrorOutlineOutlinedIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.expired,
        };
      case "MISSING_INFO":
        return {
          icon: <ErrorOutlineOutlinedIcon fontSize="inherit" color="inherit" />,
          color: colorPalette.icons.missingInfo,
        };
      default:
        return { icon: <></>, color: "#000" };
    }
  });
};

export default additionalIconStylesCellContent;
