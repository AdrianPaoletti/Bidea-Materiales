import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import styles from "./QuantityCellContent.module.scss";

interface QuantityCellContentProps {
  content: number;
  handleChange?: () => {};
}

const QuantityCellContent = ({
  content,
  handleChange,
}: QuantityCellContentProps) => {
  return (
    <Box className={styles["quantity-cell"]}>
      <div className={`${styles["quantity-cell__buttons"]} u-icon-font-size`}>
        <IconButton sx={{ padding: "0.15rem" }}>
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton sx={{ padding: "0.15rem" }}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </div>
      <Typography noWrap component={"p"}>
        {content}
      </Typography>
    </Box>
  );
};

export default QuantityCellContent;
