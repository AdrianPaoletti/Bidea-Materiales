import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";

import { ContentCell } from "resources-management/core/models/content-cell.model";
import { NameDescription } from "../../../core/models/description-name.model";
import { IconContentCell } from "../../../core/models/icon-content-cell.model";

type NullableRowItem = string | undefined | null;

export interface ReturnsTableRow {
  id: string;
  nameDescription: NameDescription[];
  quantity: number;
  refference: NullableRowItem;
  serialNumber: NullableRowItem;
  expireDate: NullableRowItem;
  manufacturer: NullableRowItem;
  type: NullableRowItem;
  state: BookingTrackingState;
  incidence: Array<BookingTrackingIncidence>;
  actionIconButtons: string;
}

type ReturnsTableRowKeys = keyof ReturnsTableRow;
export type ReturnsTableRowValues = ReturnsTableRow[ReturnsTableRowKeys];

export interface ReturnsTableColumn {
  align: "left" | "inherit" | "center" | "right" | "justify";
  id: ReturnsTableRowKeys;
  label: string;
  width: string;
  paddingLeft?: string;
  paddingRight?: string;
  showCheckBox?: boolean;
  format?: (
    value: ReturnsTableRowValues
  ) => string | number | React.ReactNode | undefined;
  additionalIconContent?: (
    value: BookingTrackingState[] | BookingTrackingIncidence[]
  ) => IconContentCell[];
  cellContent?: (
    cell: ContentCell,
    additionalIconContent?: IconContentCell[],
  ) => JSX.Element;
}
