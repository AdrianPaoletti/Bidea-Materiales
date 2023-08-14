import { UseTranslationResponse } from "react-i18next";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import ActionIconButtonsCellContent from "resources-management/components/shared/TableCellContent/ActionIconButtonsCellContent/ActionIconButtonsCellContent";
import AdditionalIconCellContent from "resources-management/components/shared/TableCellContent/AdditionalIconCellContent/AdditionalIconCellContent";
import CheckboxCellContent from "resources-management/components/shared/TableCellContent/CheckboxCellContent/CheckboxCellContent";
import {
  Content,
  ContentCell,
} from "resources-management/core/models/content-cell.model";
import { NameDescription } from "resources-management/core/models/description-name.model";
import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";
import { TableMenuItem } from "resources-management/core/models/table-menu-item.model";
import {
  LoadedResourcesRowMenuItems,
  LoadedResourcesTableColumn,
  LoadedResourcesTableRowValues,
} from "../../components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";
import additionalIconStylesCellContent from "../../components/shared/TableCellContent/AdditionalIconCellContent/additional-icon-styles-cell-content";
import { BookingTrackingIncidenceI18n } from "../../core/models/i18n.model";
import i18n from "../../statics/locales/i18n";
import { formatStringToDate } from "../date-utils/format-date.utils";

const getLoadedResourcesTableColumns = (
  resourcesCategories: ResourceCategoryDTO[],
  translationResponse: UseTranslationResponse<"translation", undefined>,
  loadedResourcesRowMenuItems: LoadedResourcesRowMenuItems[],
  handleDeleteClick: (rowId: string) => void
): LoadedResourcesTableColumn[] => [
  {
    id: "nameDescription",
    label: "name_description",
    align: "left",
    width: "26rem",
    paddingLeft: "4rem",
    showCheckBox: true,
    cellContent: ({
      content,
      showCheckBox,
      boxChecked,
      incidence,
    }: ContentCell) => (
      <CheckboxCellContent
        showCheckBox={showCheckBox}
        maxWidth={"25rem"}
        nameDescription={content as NameDescription[]}
        boxChecked={boxChecked}
        incidence={incidence}
      />
    ),
  },
  {
    id: "quantity",
    label: "quantity",
    align: "right",
    width: "9.5rem",
  },
  {
    id: "refference",
    label: "refference",
    align: "left",
    width: "18rem",
  },
  {
    id: "serialNumber",
    label: "serial_number",
    align: "right",
    width: "18rem",
  },
  {
    id: "expireDate",
    label: "expiration",
    align: "right",
    width: "11.5rem",
    format: (date: LoadedResourcesTableRowValues) =>
      date ? formatStringToDate(date as string) : "",
  },
  {
    id: "manufacturer",
    label: "manufacturer",
    align: "left",
    width: "18rem",
  },
  {
    id: "type",
    label: "type",
    align: "left",
    width: "18rem",
    format: (idType: LoadedResourcesTableRowValues): string | undefined =>
      resourcesCategories.find(({ id }) => id === (idType as string))?.name,
  },
  {
    id: "state",
    label: "state",
    align: "left",
    width: "20rem",
    format: (bookingTrackingState: LoadedResourcesTableRowValues): string[] => [
      (bookingTrackingState as BookingTrackingState).i18n[
        translationResponse.i18n.language as BookingTrackingIncidenceI18n
      ],
    ],
    additionalIconContent: (
      bookingTracking: BookingTrackingState[] | BookingTrackingIncidence[]
    ) => additionalIconStylesCellContent(bookingTracking),
    cellContent: (
      { content }: ContentCell,
      additionalIconContent?: IconContentCell[]
    ) => (
      <AdditionalIconCellContent
        additionalIconContent={additionalIconContent as IconContentCell[]}
        content={content as Content[]}
        maxWidth={"20rem"}
      />
    ),
  },
  {
    id: "incidence",
    label: "incidence",
    align: "left",
    width: "26.6rem",
    format: (bookingTrackingState: LoadedResourcesTableRowValues): string[] =>
      (bookingTrackingState as BookingTrackingIncidence[]).map(
        (state) => state.i18n[i18n.language as BookingTrackingIncidenceI18n]
      ),
    additionalIconContent: (
      bookingTracking: BookingTrackingState[] | BookingTrackingIncidence[]
    ) => additionalIconStylesCellContent(bookingTracking),
    cellContent: (
      { content }: ContentCell,
      additionalIconContent?: IconContentCell[]
    ) => (
      <AdditionalIconCellContent
        additionalIconContent={additionalIconContent as IconContentCell[]}
        content={content as Content[]}
        maxWidth={"26.6rem"}
      />
    ),
  },
  {
    id: "actionIconButtons",
    label: "",
    align: "right",
    width: "11.8rem",
    paddingRight: "3rem",
    menuOptions: loadedResourcesRowMenuItems,
    cellContent: (
      { rowId },
      additional,
      menuItems: TableMenuItem[] | undefined
    ) => (
      <ActionIconButtonsCellContent
        rowId={rowId as string}
        menuItems={menuItems as TableMenuItem[]}
        menuPosition={{ horizontal: -164, vertical: 33 }}
        handleDeleteClick={handleDeleteClick}
      />
    ),
  },
];

export default getLoadedResourcesTableColumns;
