import ActionIconButtonsCellContent from "resources-management/components/shared/TableCellContent/ActionIconButtonsCellContent/ActionIconButtonsCellContent";
import { TableMenuItem } from "resources-management/core/models/table-menu-item.model";
import { formatStringToDate } from "resources-management/utils/date-utils/format-date.utils";
import {
  ReportsMenuOptions,
  ReportsTableColumn,
  ReportsTableRowValues,
} from "../../components/Reports/ReportsTable/reports-table.model";

const getReportsTableColumns = (
  reportsMenuOptions: ReportsMenuOptions[]
): ReportsTableColumn[] => [
  {
    id: "interventionRequestCode",
    label: "intervention_code",
    align: "right",
    width: "8rem",
    paddingLeft: "2rem",
  },
  {
    id: "hub",
    label: "Centro",
    align: "left",
    width: "2rem",
  },
  {
    id: "NHC",
    label: "nhc_patient",
    align: "right",
    width: "23rem",
  },
  {
    id: "patientCompleteName",
    label: "patient_name",
    align: "left",
    width: "23rem",
  },
  {
    id: "interventionDate",
    label: "intervention_date",
    align: "right",
    width: "23rem",
    format: (date: ReportsTableRowValues) =>
      date ? formatStringToDate(date as string) : "",
  },
  {
    id: "price",
    label: "price",
    align: "right",
    width: "23rem",
    format: (price: ReportsTableRowValues) => `${price} €`,
  },
  {
    id: "actionButtons",
    label: "",
    align: "right",
    width: "23rem",
    paddingRight: "2rem",
    menuOptions: reportsMenuOptions,
    cellContent: ({ rowId }, menuItems: TableMenuItem[] | undefined) => (
      <ActionIconButtonsCellContent
        rowId={rowId as string}
        menuItems={menuItems as TableMenuItem[]}
        showDeleteIcon={false}
        menuPosition={{ horizontal: -250, vertical: 33 }}
      />
    ),
  },
];

export default getReportsTableColumns;
