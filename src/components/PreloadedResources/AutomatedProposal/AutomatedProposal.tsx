import { useTranslation } from "react-i18next";

import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";
import AddIcon from "@mui/icons-material/Add";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import { Box, Chip } from "@mui/material";

import ModalWrapper from "resources-management/components/shared/ModalWrapper/ModalWrapper";
import {
  ContainedButton,
  SubmitButton,
  TextButton,
} from "resources-management/components/shared/UI/Buttons";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import { PreLoadedResourcesTableRow } from "../PreloadedResourcesTable/preloaded-resources-table.model";
import PreloadedResourcesTable from "../PreloadedResourcesTable/PreloadedResourcesTable";

import styles from "./AutomatedProposal.module.scss";

interface AutomatedProposalProps {
  resourcesCategories: ResourceCategoryDTO[];
  proposalTableRows: PreLoadedResourcesTableRow[];
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoriesQuantity?: { [key: string]: number };
  handleClick: () => Promise<void>;
}

const AutomatedProposal = ({
  resourcesCategories,
  proposalTableRows,
  isModalOpen,
  setIsModalOpen,
  categoriesQuantity,
  handleClick,
}: AutomatedProposalProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <Box
      component={"div"}
      className={`${styles["automated-proposal"]} u-padding-medium`}
    >
      <div className={`${styles["automated-proposal__container"]}`}>
        <h2 className={`heading-secondary u-margin-bottom-small-medium`}>
          {t("common:automated_resource_proposal")}
        </h2>
        <div className={`${styles["automated-proposal__categories"]}`}>
          {resourcesCategories.map(({ id, name }, indexNumber) => (
            <Chip
              key={`${id}_${indexNumber}`}
              label={
                <Box
                  className={`${styles["automated-proposal__categories-chip"]}`}
                >
                  <p>{name}</p>
                  {!!categoriesQuantity?.[id] && (
                    <span className="u-bold">{categoriesQuantity?.[id]}</span>
                  )}
                </Box>
              }
              sx={{
                backgroundColor: `${colorPalette.primary.light}`,
                color: `${colorPalette.primary.mainInfo}`,
                "& .MuiChip-label": {
                  paddingRight: !!categoriesQuantity?.[id] ? "0.6rem" : "",
                },
              }}
            />
          ))}
        </div>
      </div>
      <form
        className={`${styles["automated-proposal__buttons"]}`}
        onSubmit={(event) => {
          event.preventDefault();
          handleClick();
        }}
      >
        <TextButton
          label={"see_proposal"}
          padding={"0.7rem 2.5rem"}
          onClickHandler={() => setIsModalOpen(true)}
        />

        <SubmitButton
          label={"assign_proposal"}
          icon={<AddIcon />}
          color={"secondary"}
          padding={"0.7rem 2.5rem"}
          width={"25.1rem"}
        />
      </form>
      <ModalWrapper
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        headerTitle={"automated_resource_proposal"}
        icon={<WidgetsOutlinedIcon fontSize="inherit" color="inherit" />}
      >
        <div className={styles["automated-proposal__modal"]}>
          <PreloadedResourcesTable
            tableRows={proposalTableRows}
            resourcesCategories={resourcesCategories}
            isTableModal={true}
          />
          <div className={styles["automated-proposal__buttons"]}>
            <TextButton
              label={"cancel"}
              onClickHandler={() => setIsModalOpen(false)}
            />
            <ContainedButton label={"apply"} onClickHandler={handleClick} />
          </div>
        </div>
      </ModalWrapper>
    </Box>
  );
};

export default AutomatedProposal;
