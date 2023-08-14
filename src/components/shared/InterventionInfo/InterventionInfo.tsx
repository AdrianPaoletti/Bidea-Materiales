import { useTranslation } from "react-i18next";

import { InterventionDTO } from "@ikusi/resources-management-api-typescript-fetch";
import { Box } from "@mui/material";

import { formatStringToDateHour } from "resources-management/utils/date-utils/format-date.utils";

import styles from "./InterventionInfo.module.scss";

interface InterventionInfoProps {
  interventionData: InterventionDTO;
}

const InterventionInfo = ({
  interventionData: { requestCode, procedureId, operatingRoom, dateFrom },
}: InterventionInfoProps) => {
  const { t } = useTranslation(["common", "cta"]);
  return (
    <Box className={`${styles["intervention-info"]} u-padding-medium`}>
      <h2 className="heading-terciary">
        {t("common:intervention_information")}
      </h2>
      <div className={`${styles["intervention-info__information"]}`}>
        <div className={styles["intervention-info__information-block"]}>
          <p>
            <span className="u-bold">NHC: </span>
            {requestCode || "-"}
          </p>
          <p>
            <span className="u-bold">{t("common:intervention")}: </span>
            {procedureId}
          </p>
        </div>
        <div className={styles["intervention-info__information-block"]}>
          <p>
            <span className="u-bold">{t("common:operating_room")}: </span>
            {operatingRoom}
          </p>
          <p>
            <span className="u-bold">{t("common:date")}: </span>
            {dateFrom.length ? formatStringToDateHour(dateFrom) : "-"}
          </p>
        </div>
      </div>
    </Box>
  );
};

export default InterventionInfo;
