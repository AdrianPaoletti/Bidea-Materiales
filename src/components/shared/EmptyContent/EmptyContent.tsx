import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import styles from "./EmptyContent.module.scss";

export interface EmptyContentProps {
  text: string;
  icon: JSX.Element;
  height: string;
}

const EmptyContent = ({ text, icon, height }: EmptyContentProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <Box className={`${styles["empty-content"]}`} height={height}>
      <div className={`${styles["empty-content__container"]}`}>
        {icon}
        <p>{t(`common:${text}`)}</p>
      </div>
    </Box>
  );
};

export default EmptyContent;
