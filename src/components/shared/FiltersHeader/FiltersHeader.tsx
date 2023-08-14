import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BarcodeReadingDTO,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { SelectChangeEvent } from "@mui/material";

import { ActiveFilters } from "resources-management/core/models/active-filters.model";
import { SelectedItems } from "resources-management/core/models/select-change-event-value.model";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { ContainedButton } from "../UI/Buttons";
import SelectDropdownInputs from "../UI/SelectDropdownInputs";
import TextSearchField from "../UI/TextInputs";
import ScanMaterial from "./ScanMaterials/ScanMaterials";

import styles from "./FiltersHeader.module.scss";

export interface FiltersHeaderProps {
  onBarcodeReaded: (barcodeReadingDTO: BarcodeReadingDTO) => unknown;
  resourcesCategories: ResourceCategoryDTO[];
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  chargeState?: { total: number; charged: number };
}

const FiltersHeader = ({
  onBarcodeReaded,
  resourcesCategories,
  setActiveFilters,
  chargeState,
}: FiltersHeaderProps) => {
  const { t } = useTranslation(["common"]);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<SelectedItems>) => {
    const { value } = event.target;
    const categories = (value as string[]).map((categoryName) => {
      const { id, name } = resourcesCategories.find(
        ({ name: materialTypeName }) => materialTypeName === categoryName
      ) as ResourceCategoryDTO;
      return { id, name };
    });
    setSelectedMaterials(value as string[]);
    setActiveFilters((prevActiveFilters) => ({
      ...prevActiveFilters,
      categories,
    }));
  };

  const handleDelete = (value: string) => {
    setSelectedMaterials((prevSelectedMaterials) =>
      prevSelectedMaterials.filter(
        (prevSelectedMaterial) => prevSelectedMaterial !== value
      )
    );
    setActiveFilters((prevActiveFilters: ActiveFilters) => ({
      ...prevActiveFilters,
      categories: prevActiveFilters.categories.filter(
        ({ name: categoryName }) => categoryName !== value
      ),
    }));
  };

  const handleInputsFiltersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setActiveFilters((prevActiveFilters) => ({
      ...prevActiveFilters,
      [name]: value.toLowerCase().trim(),
    }));
  };

  const isCharged = (chargeState: { total: number; charged: number }) => {
    return chargeState && chargeState?.total <= chargeState?.charged;
  };

  return (
    <section className={`${styles["filters-header"]} u-padding-medium`}>
      <article className={`${styles["filters-header__filters"]}`}>
        <div>
          <div className={styles["filters-header__select-categories"]}>
            <SelectDropdownInputs
              selectedItems={selectedMaterials}
              menuItems={resourcesCategories}
              handleChange={handleChange}
              handleDelete={handleDelete}
              label={"material_types"}
              isMultiple={true}
              isFullWidth={true}
            />
          </div>
        </div>
        <TextSearchField
          label={"name_description"}
          changeHandler={handleInputsFiltersChange}
          name={"nameDescription"}
        />

        <TextSearchField
          label={"refference"}
          changeHandler={handleInputsFiltersChange}
          name={"refference"}
        />
      </article>
      <article className={`${styles["filters-header__action-buttons"]}`}>
        <ContainedButton
          icon={<QrCodeScannerIcon fontSize="large" color="inherit" />}
          label={"scan_material"}
          onClickHandler={() => setIsScanModalOpen(true)}
        />
      </article>
      {chargeState && (
        <span
          className={
            isCharged(chargeState)
              ? `${styles["filters-header__load-state"]} u-margin-left-auto`
              : `${styles["filters-header__load-state-incomplete"]} u-margin-left-auto`
          }
        >
          {`${t("common:charge_status")}:`} {chargeState.charged} {"/"}{" "}
          {chargeState.total}
        </span>
      )}
      <ModalWrapper
        setIsOpen={setIsScanModalOpen}
        isOpen={isScanModalOpen}
        headerTitle={"material_scanning"}
        icon={<QrCodeScannerIcon fontSize="inherit" color="inherit" />}
      >
        <ScanMaterial
          setIsOpen={setIsScanModalOpen}
          onBarcodeReaded={onBarcodeReaded}
        />
      </ModalWrapper>
    </section>
  );
};

export default FiltersHeader;
