import { useTranslation } from "react-i18next";

import MergeIcon from "@mui/icons-material/Merge";
import { IconButton, Tooltip } from "@mui/material";

interface MergeMaterialCellContentProps {
  handleClick: () => void;
}

const MergeMaterialCellContent = ({
  handleClick,
}: MergeMaterialCellContentProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <Tooltip
      title={t("merge_material")}
      placement="bottom-end"
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [-5, -9],
            },
          },
        ],
      }}
    >
      <IconButton onClick={() => handleClick()}>
        <MergeIcon fontSize="medium" />
      </IconButton>
    </Tooltip>
  );
};

export default MergeMaterialCellContent;
