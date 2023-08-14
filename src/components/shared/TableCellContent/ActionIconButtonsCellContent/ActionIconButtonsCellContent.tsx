import React from "react";
import { useTranslation } from "react-i18next";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import { TableMenuItem } from "resources-management/core/models/table-menu-item.model";

import styles from "./ActionIconButtonsCellContent.module.scss";

interface ActionIconButtonsCellContentProps {
  rowId: string;
  menuItems: TableMenuItem[];
  menuPosition?: { horizontal: number; vertical: number };
  showDeleteIcon?: boolean;
  handleDeleteClick?: Function;
}

const ActionIconButtonsCellContent = ({
  rowId,
  menuItems,
  menuPosition = { horizontal: -164, vertical: 33 },
  showDeleteIcon = true,
  handleDeleteClick,
}: ActionIconButtonsCellContentProps) => {
  const { t } = useTranslation(["common"]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClick = (item: TableMenuItem) => {
    handleClose();
    item.action(rowId);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="div"
      className={`${styles["action-icons"]} u-icon-font-size`}
    >
      {!!menuItems.length && (
        <IconButton
          id="basic-button"
          aria-controls={open ? rowId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon fontSize="inherit" />
        </IconButton>
      )}
      {!!menuItems.length && (
        <Menu
          id={rowId}
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: menuPosition.vertical,
            horizontal: menuPosition.horizontal,
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {menuItems.map((item) => (
            <MenuItem key={item.label} onClick={() => handleMenuClick(item)}>
              <ListItemIcon>{item.icon()}</ListItemIcon>
              <ListItemText>{t(item.label)}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
      {showDeleteIcon && (
        <IconButton
          onClick={
            handleDeleteClick ? () => handleDeleteClick(rowId) : () => void 0
          }
        >
          <DeleteOutlineIcon fontSize="inherit" />
        </IconButton>
      )}
    </Box>
  );
};

export default ActionIconButtonsCellContent;
