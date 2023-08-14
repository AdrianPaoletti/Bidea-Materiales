import {
  BookingTrackingIncidence,
  BookingTrackingState,
  FullBookingTrackingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import { ContentCell } from "resources-management/core/models/content-cell.model";
import { NameDescription } from "resources-management/core/models/description-name.model";
import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";

export type NameDescriptionQuantity = {
  name: string | undefined | null;
  description: string | undefined | null;
  quantity?: number;
};

export type ToTableType = FullBookingTrackingDTO & {
  quantity: number;
  children: FullBookingTrackingDTO[];
};

type NullableRowItem = number | string | undefined | null;

export interface ChargeToPatientTableRow {
  id: string;
  openIcon?: React.ReactNode;
  nameDescription: NameDescription[];
  quantity: number | undefined;
  refference: NullableRowItem;
  serialNumber: NullableRowItem;
  price: NullableRowItem;
  state: BookingTrackingState;
  incidence: Array<BookingTrackingIncidence>;
  actionIconButtons: string;
  children: ChargeToPatientTableRow[] | null;
}

type ChargeToPatientTableRowKeys = keyof ChargeToPatientTableRow;
export type ChargeToPatientTableRowValues =
  ChargeToPatientTableRow[ChargeToPatientTableRowKeys];

export interface ChargeToPatientTableColumn {
  align: "left" | "inherit" | "center" | "right" | "justify";
  id: ChargeToPatientTableRowKeys;
  label: string;
  width: string;
  paddingLeft?: string;
  paddingRight?: string;
  format?: (
    value: ChargeToPatientTableRowValues
  ) => string | number | React.ReactNode | undefined;
  additionalIconContent?: (
    value: BookingTrackingState[] | BookingTrackingIncidence[]
  ) => IconContentCell[];
  cellContent?: (
    cell: ContentCell,
    additionalIconContent?: IconContentCell[]
  ) => JSX.Element;
}
