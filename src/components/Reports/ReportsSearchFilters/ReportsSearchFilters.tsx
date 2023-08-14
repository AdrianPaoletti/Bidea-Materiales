import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material";

import { ChangeEventDatePicker } from "resources-management/components/shared/FiltersHeader/ScanMaterials/scan-materials.model";
import { CLoadingButton } from "resources-management/components/shared/UI/Buttons";
import DateCalendarPicker from "resources-management/components/shared/UI/DateCalendarPicker";
import OutlinedInputs from "resources-management/components/shared/UI/OutlinedInputs";
import SelectDropdownInputs from "resources-management/components/shared/UI/SelectDropdownInputs";
import {
  OperatingRoomCategoriesId,
  ReportQueryFilters,
} from "resources-management/core/models/report-query-filters.model";
import { SelectedResourcesCategories } from "resources-management/core/models/selected-resources-categories.model";
import { formatDateHourToBackend } from "resources-management/utils/date-utils/format-date.utils";
import {
  DatePickerData,
  DropDownInputs,
  SelectedDates,
  SelectedOperatingRoomsAndCategories,
} from "../reports.model";

import styles from "./ReportsSearchFilters.module.scss";

export interface ReportsSearchFiltersProps {
  reportQueryFilters: ReportQueryFilters;
  setReportQueryFilters: React.Dispatch<
    React.SetStateAction<ReportQueryFilters>
  >;
  selectedOperatingRoomsAndCategories: SelectedOperatingRoomsAndCategories;
  setSelectedOperatingRoomsAndCategories: React.Dispatch<
    React.SetStateAction<SelectedOperatingRoomsAndCategories>
  >;
  operatingRooms: OperatingRoomCategoriesId[];
  resourcesCategories: ResourceCategoryDTO[];
  isLoading: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ReportsSearchFilters = ({
  reportQueryFilters,
  setReportQueryFilters,
  selectedOperatingRoomsAndCategories,
  setSelectedOperatingRoomsAndCategories,
  operatingRooms,
  resourcesCategories,
  isLoading,
  handleSubmit,
}: ReportsSearchFiltersProps) => {
  const { t } = useTranslation(["common"]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    dateFrom: null,
    dateTo: null,
  });

  useEffect(() => {
    const { dateFrom, dateTo } = reportQueryFilters;
    if (dateFrom && dateTo) {
      setIsDisabled(false);
      return;
    }
    setIsDisabled(true);
  }, [reportQueryFilters]);

  const datePickerData: DatePickerData[] = [
    { id: "dateFrom", label: "start_date" },
    { id: "dateTo", label: "end_date", minDate: selectedDates.dateFrom },
  ];
  const dropDownInputs: DropDownInputs[] = [
    {
      id: "operatingRoomExternalCodes",
      label: "operating_rooms",
      menuItems: operatingRooms,
      className: "operating-rooms",
    },
    {
      id: "categoryIds",
      label: "material_types",
      menuItems: resourcesCategories,
      className: "select-categories",
    },
  ];

  const handleDatePickerChange = (
    event: ChangeEventDatePicker | null,
    id: string
  ) => {
    setSelectedDates((prevSelectedDates) => ({
      ...prevSelectedDates,
      [id]: event,
    }));
    setReportQueryFilters((prevReportsSearchValues) => ({
      ...prevReportsSearchValues,
      [id]: formatDateHourToBackend((event as ChangeEventDatePicker).$d),
    }));
  };

  const handleDatePickerDelete = (id: string) => {
    setSelectedDates((prevSelectedDates) => ({
      ...prevSelectedDates,
      [id]: null,
    }));
    setReportQueryFilters((prevReportsSearchValues) => ({
      ...prevReportsSearchValues,
      [id]: null,
    }));
  };

  const setterOperatingRoomsAndCategories = (
    name: keyof ReportQueryFilters,
    selectedValues: string[],
    reportSearchValues:
      | OperatingRoomCategoriesId[]
      | SelectedResourcesCategories[]
  ) => {
    setSelectedOperatingRoomsAndCategories(
      (prevSelectedOperatingRoomsAndCategories) => ({
        ...prevSelectedOperatingRoomsAndCategories,
        [name]: selectedValues,
      })
    );
    setReportQueryFilters((prevReportsSearchValues) => ({
      ...prevReportsSearchValues,
      [name]: reportSearchValues,
    }));
  };

  const handleOperatingRoomsAndCategoriesChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const { value, name } = event.target;
    if (name === "categoryIds") {
      const categories = (value as string[]).map((categoryName) => {
        const { id, name } = resourcesCategories.find(
          ({ name: materialTypeName }) => materialTypeName === categoryName
        ) as ResourceCategoryDTO;
        return { id, name };
      });
      setterOperatingRoomsAndCategories(name, value as string[], categories);
    }
    if (name === "operatingRoomExternalCodes") {
      const operationRooms = (value as string[]).map((operatingRoomName) => {
        const { name, id } = operatingRooms.find(
          ({ name }) => name === operatingRoomName
        ) as OperatingRoomCategoriesId;
        return { name, id };
      });
      setterOperatingRoomsAndCategories(
        name,
        value as string[],
        operationRooms
      );
    }
  };

  const handleOperatingRoomsAndCategoriesDelete = (
    value: string,
    id: keyof SelectedOperatingRoomsAndCategories | undefined
  ) => {
    if (id) {
      setSelectedOperatingRoomsAndCategories(
        (prevSelectedOperatingRoomsAndCategories) => ({
          ...prevSelectedOperatingRoomsAndCategories,
          [id]: prevSelectedOperatingRoomsAndCategories[id].filter(
            (selectedOperatingRoomAndCategory) =>
              selectedOperatingRoomAndCategory !== value
          ),
        })
      );
      setReportQueryFilters((prevReportsSearchValues: ReportQueryFilters) => ({
        ...prevReportsSearchValues,
        [id]: prevReportsSearchValues[id]?.filter(({ name }) => name !== value),
      }));
    }
  };

  const handleReferenceCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setReportQueryFilters((prevReportsSearchValues) => ({
      ...prevReportsSearchValues,
      interventionRequestCode: +value,
    }));
  };

  return (
    <form
      className={`${styles["reports-search-filters"]} u-padding-medium`}
      onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}
    >
      {datePickerData.map(({ id, label, minDate }) => (
        <DateCalendarPicker
          id={id}
          label={label}
          handleChange={handleDatePickerChange}
          handleDelete={handleDatePickerDelete}
          key={id}
          minDate={minDate || undefined}
          value={selectedDates[id as keyof SelectedDates]}
          helperText={t("common:required") as string}
        />
      ))}
      <OutlinedInputs
        id={"interventionRequestCode"}
        label={"request_code"}
        handleChange={handleReferenceCodeChange}
      />
      {dropDownInputs.map(({ id, label, menuItems, className }) => (
        <div
          className={styles[`reports-search-filters__${className}`]}
          key={id}
        >
          <SelectDropdownInputs
            selectedItems={selectedOperatingRoomsAndCategories[id]}
            menuItems={menuItems}
            handleChange={handleOperatingRoomsAndCategoriesChange}
            handleDelete={handleOperatingRoomsAndCategoriesDelete}
            label={label}
            id={id}
            isMultiple={true}
            isFullWidth={true}
          />
        </div>
      ))}
      <CLoadingButton
        label={"consult"}
        isLoading={isLoading}
        icon={<SearchIcon fontSize="inherit" color="inherit" />}
        // isDisabled={isDisabled}
      />
    </form>
  );
};

export default ReportsSearchFilters;
