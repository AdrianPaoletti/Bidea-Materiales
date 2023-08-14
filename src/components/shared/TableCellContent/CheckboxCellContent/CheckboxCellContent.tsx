import { useTranslation } from "react-i18next";

import ErrorIcon from "@mui/icons-material/Error";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Checkbox, Tooltip } from "@mui/material";

import { NameDescription } from "resources-management/core/models/description-name.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import OverflowTooltipCellContent from "../OverflowTooltipCellContent/OverflowTooltipCellContent";

import styles from "./CheckboxCellContent.module.scss";

interface CheckboxCellContentProps {
  nameDescription: NameDescription[];
  maxWidth: string;
  showCheckBox?: boolean;
  boxChecked?: boolean;
  available?: boolean;
  booked?: boolean;
  incidence?: string;
  incidenceRightPositioning?: string;
}
const CheckboxCellContent = ({
  nameDescription,
  maxWidth,
  showCheckBox = false,
  boxChecked,
  available,
  booked,
  incidence,
  incidenceRightPositioning,
}: CheckboxCellContentProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <Box className={styles["checkbox-content-cell"]}>
      {showCheckBox && (
        <Checkbox color="secondary" checked={boxChecked || false} />
      )}
      <div className={styles["checkbox-content-cell__container"]}>
        <div
          className={`${styles["checkbox-content-cell__name-description"]} ${
            !showCheckBox &&
            styles["checkbox-content-cell__name-description--no-checkbox"]
          }`}
        >
          <Box sx={{ maxWidth }}>
            {nameDescription?.map(({ id, value }) => {
              return (
                <OverflowTooltipCellContent
                  key={`${value}-${id}`}
                  id={id}
                  content={value}
                />
              );
            })}
          </Box>
          {nameDescription[0].value?.length && (
            <div>
              {!!incidence && (
                <FiberManualRecordIcon
                  sx={{
                    fontSize: "1.2rem",
                    position: "absolute",
                    top: 0,
                    right: incidenceRightPositioning
                      ? incidenceRightPositioning
                      : 0,
                    color:
                      incidence === "EXPIRED"
                        ? colorPalette.icons.expired
                        : colorPalette.icons.missingIdentification,
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div className={styles["checkbox-content-cell__icons"]}>
          {available === false && (
            <Tooltip
              title={t("resource_not_available")}
              placement="bottom-start"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -7],
                    },
                  },
                ],
              }}
            >
              <ErrorIcon color="error" />
            </Tooltip>
          )}
          {booked && (
            <Tooltip
              title={t("resource_already_been_reserved")}
              placement="bottom-start"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -7],
                    },
                  },
                ],
              }}
            >
              <ReportProblemIcon color="warning" />
            </Tooltip>
          )}
        </div>
      </div>
    </Box>
  );
};

export default CheckboxCellContent;
