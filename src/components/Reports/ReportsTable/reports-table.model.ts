import { ContentCell } from "resources-management/core/models/content-cell.model";

export interface ReportsTableRow {
  price: number;
  hub: string;
  interventionRequestCode: number;
  NHC: string;
  patientCompleteName: string;
  interventionDate: string;
  actionButtons: string;
}

type ReportsTableRowKeys = keyof ReportsTableRow;
export type ReportsTableRowValues = ReportsTableRow[ReportsTableRowKeys];

export interface ReportsTableColumn {
  align: "left" | "inherit" | "center" | "right" | "justify";
  id: ReportsTableRowKeys;
  label: string;
  width: string;
  paddingLeft?: string;
  paddingRight?: string;
  menuOptions?: ReportsMenuOptions[];
  format?: (value: ReportsTableRowValues) => string | number | React.ReactNode;
  cellContent?: (
    cell: ContentCell,
    menuItems?: ReportsMenuOptions[]
  ) => JSX.Element;
}

export interface ReportsMenuOptions {
  label: string;
  action: (id?: string) => void;
  icon: () => JSX.Element;
}
