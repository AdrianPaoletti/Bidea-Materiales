import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";

import { ContentCell } from "resources-management/core/models/content-cell.model";
import { NameDescription } from "resources-management/core/models/description-name.model";
import { IconContentCell } from "resources-management/core/models/icon-content-cell.model";

type NullableRowItem = string | undefined | null;

export interface PreLoadedResourcesTableRow {
  id: NullableRowItem;
  nameDescription: NameDescription[];
  quantity: number | null;
  type: NullableRowItem;
  actionIconButtons: NullableRowItem;
  parentId: NullableRowItem;
  isBooked: boolean;
  isAvailable: boolean;
}

type PreLoadedResourcesTableRowKeys = keyof PreLoadedResourcesTableRow;
export type PreLoadedResourcesTableRowValues =
  PreLoadedResourcesTableRow[PreLoadedResourcesTableRowKeys];

export interface PreloadedResoucesTableColumn {
  id: PreLoadedResourcesTableRowKeys;
  label: string;
  align: "left" | "inherit" | "center" | "right" | "justify";
  width: string;
  paddingLeft?: string;
  paddingRight?: string;
  additionalIconContent?: (
    value: BookingTrackingState[] | BookingTrackingIncidence[]
  ) => IconContentCell[];
  format?: (value: PreLoadedResourcesTableRowValues) => string | undefined;
  cellContent?: (cell: ContentCell) => JSX.Element;
}
