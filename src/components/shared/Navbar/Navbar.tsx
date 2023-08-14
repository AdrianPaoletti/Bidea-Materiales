import { useContext } from "react";
import { useTranslation } from "react-i18next";

import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Tab, Tabs, Tooltip } from "@mui/material";

import ResourcesManagementContext from "../../../core/store/context/ResourcesManagementContext";

import styles from "./Navbar.module.scss";

export interface NavbarProps {
  tabValue: string;
  setTabValue: React.Dispatch<React.SetStateAction<string>>;
  materialsItemsLabels: string[];
}

const Navbar = ({
  tabValue,
  setTabValue,
  materialsItemsLabels,
}: NavbarProps) => {
  const { t } = useTranslation(["common"]);
  const handleChange = (event: React.SyntheticEvent, newTabValue: string) => {
    setTabValue(newTabValue);
  };
  const { prevUrl } = useContext(ResourcesManagementContext);

  const handleClick = () => {
    window.location.href = prevUrl;
  };

  return (
    <section className={styles.navbar}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="navbar-items-materials"
      >
        {materialsItemsLabels.map((materialsItemLabel) => (
          <Tab
            value={materialsItemLabel}
            label={t(`common:${materialsItemLabel}`)}
            color="secondary"
            key={materialsItemLabel}
          />
        ))}
      </Tabs>
      <div className={styles["navbar__redirect"]}>
        <Tooltip
          title={t("common:back_to_forward")}
          placement="bottom-start"
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [-5, -11],
                },
              },
            ],
          }}
        >
          <IconButton onClick={handleClick}>
            <LogoutIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </div>
    </section>
  );
};

export default Navbar;
