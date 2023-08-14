import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { Backdrop, Box, Fade, Modal } from "@mui/material";

import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import { formatStringToDateHour } from "resources-management/utils/date-utils/format-date.utils";

import styles from "./ModalWrapper.module.scss";

interface ModalWrapperProps {
  children: JSX.Element;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerTitle: string;
  icon: JSX.Element;
  showInterventionInfo?: boolean;
  width?: string;
  height?: string;
}

const ModalWrapper = ({
  children,
  isOpen,
  setIsOpen,
  headerTitle,
  icon,
  showInterventionInfo = true,
  width,
  height,
}: ModalWrapperProps) => {
  const {
    interventionData: { requestCode, procedureId, operatingRoom, dateFrom },
  } = useContext(ResourcesManagementContext);
  const { t } = useTranslation(["common"]);
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box className={`${styles["modal"]}`} sx={{ width, height }}>
          <header className={`${styles["modal__header"]} u-padding-modal`}>
            <div className={`${styles["modal__title"]}`}>
              <div className={`${styles["modal__icon"]} u-icon-font-size`}>
                {icon}
              </div>
              <h2
                className={`${styles["modal__title-text"]} u-margin-left-small`}
              >
                {t(`common:${headerTitle}`)}
              </h2>
            </div>
            <div
              className={`${styles["modal__close-icon"]}`}
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon color="inherit" />
            </div>
          </header>
          {showInterventionInfo && (
            <div className={`${styles["intervention-info"]}`}>
              <h3
                className={`${styles["intervention-info__title"]} heading-secondary-accordion u-padding-modal`}
              >
                {t("common:intervention_information")}
              </h3>
              <p className="u-padding-modal">{`NHC: ${requestCode || "-"}`}</p>
              <p className="u-padding-modal">
                {`${t("common:intervention")}: ${procedureId}`}
              </p>
              <p className="u-padding-modal">
                {`${t("common:operating_room")}: ${operatingRoom}`}
              </p>
              <p className="u-padding-modal">
                {`${t("common:date")}: ${
                  dateFrom.length ? formatStringToDateHour(dateFrom) : "-"
                }`}
              </p>
            </div>
          )}
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalWrapper;
