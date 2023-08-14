import { Box } from "@mui/material";

import { Content } from "resources-management/core/models/content-cell.model";
import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";
import OverflowTooltipCellContent from "../OverflowTooltipCellContent/OverflowTooltipCellContent";

import styles from "./AdditionalIconCellContent.module.scss";

interface AdditionalIconCellContentProps {
  additionalIconContent: IconContentCell[];
  content: Content[];
  maxWidth: string;
}

const AdditionalIconCellContent = ({
  additionalIconContent,
  content,
  maxWidth,
}: AdditionalIconCellContentProps) => {
  return (
    <div className={styles["additional-icon"]}>
      {additionalIconContent.map(({ color, icon }, indexIcon) => (
        <Box
          key={indexIcon}
          className={styles["additional-icon__icon-container"]}
          sx={{ maxWidth }}
          color={color}
        >
          <div
            className={`${styles["additional-icon__icon"]} u-icon-font-size`}
          >
            {icon}
          </div>
          <OverflowTooltipCellContent
            content={content[indexIcon] as string | number}
            id={"additionalContent"}
          />
          {/* <Typography noWrap component="p" color={"inherit"} fontWeight={700}>
            {content[indexIcon] as string | number}
          </Typography> */}
        </Box>
      ))}
    </div>
  );
};

export default AdditionalIconCellContent;
