import { UseTranslationResponse } from "react-i18next";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconButton } from "@mui/material";

import AdditionalIconCellContent from "resources-management/components/shared/TableCellContent/AdditionalIconCellContent/AdditionalIconCellContent";
import CheckboxCellContent from "resources-management/components/shared/TableCellContent/CheckboxCellContent/CheckboxCellContent";
import {
  Content,
  ContentCell,
} from "resources-management/core/models/content-cell.model";
import { NameDescription } from "resources-management/core/models/description-name.model";
import { BookingTrackingIncidenceI18n } from "resources-management/core/models/i18n.model";
import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";
import i18n from "resources-management/statics/locales/i18n";
import {
  ChargeToPatientTableColumn,
  ChargeToPatientTableRowValues,
} from "../../components/shared/ChargeToPatient/ChargeToPatientTable/charge-to-patient-table.model";
import ActionIconButtonsCellContent from "../../components/shared/TableCellContent/ActionIconButtonsCellContent/ActionIconButtonsCellContent";
import additionalIconStylesCellContent from "../../components/shared/TableCellContent/AdditionalIconCellContent/additional-icon-styles-cell-content";

const getChargeToPatientTableColumns = (
  translationResponse: UseTranslationResponse<"translation", undefined>,
  handleDelete: (rowId: string) => void,
  showOpenIcon: boolean,
  showDeleteIcon: boolean,
  parentRowId?: string,
  isRowIdOpen?: { [key: string]: boolean },
  setIsRowIdOpen?: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
): ChargeToPatientTableColumn[] => [
  {
    id: "openIcon",
    label: "",
    align: "center",
    width: "1rem",
    ...(showOpenIcon && {
      cellContent: () => (
        <IconButton
          sx={{ padding: 0 }}
          onClick={() =>
            setIsRowIdOpen &&
            setIsRowIdOpen((prevIsRowIdOpen) => {
              return {
                ...prevIsRowIdOpen,
                [parentRowId as string]:
                  !prevIsRowIdOpen[parentRowId as string],
              };
            })
          }
        >
          {isRowIdOpen && isRowIdOpen[parentRowId as string] ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </IconButton>
      ),
    }),
  },
  {
    id: "nameDescription",
    label: "name_description",
    align: "left",
    width: "20rem",
    cellContent: ({
      content,
      showCheckBox,
      boxChecked,
      incidence,
    }: ContentCell) => (
      <CheckboxCellContent
        showCheckBox={showCheckBox}
        maxWidth={"20rem"}
        nameDescription={content as NameDescription[]}
        boxChecked={boxChecked}
        incidence={incidence}
        incidenceRightPositioning={"-1.75rem"}
      />
    ),
  },
  {
    id: "quantity",
    label: "quantity",
    align: "right",
    width: "6rem",
  },
  {
    id: "price",
    label: "price",
    align: "right",
    width: "6rem",
    format: (price: ChargeToPatientTableRowValues): string =>
      price ? `${price} €` : "",
  },
  {
    id: "refference",
    label: "refference",
    align: "left",
    width: "18rem",
  },
  {
    id: "state",
    label: "state",
    align: "left",
    width: "19rem",
    format: (bookingTrackingState: ChargeToPatientTableRowValues): string[] => [
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
        maxWidth={"19rem"}
      />
    ),
  },
  {
    id: "incidence",
    label: "incidence",
    align: "left",
    width: "24rem",
    format: (bookingTrackingState: ChargeToPatientTableRowValues): string[] =>
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
        maxWidth={"24rem"}
      />
    ),
  },
  {
    id: "actionIconButtons",
    label: "",
    align: "right",
    width: "6rem",
    ...(showDeleteIcon && {
      cellContent: ({ rowId }) => (
        <ActionIconButtonsCellContent
          rowId={rowId as string}
          handleDeleteClick={handleDelete}
          menuItems={[]}
        />
      ),
    }),
  },
];

export default getChargeToPatientTableColumns;
