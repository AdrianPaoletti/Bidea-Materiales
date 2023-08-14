import React, { useEffect } from "react";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";
import { TableCell, TableRow } from "@mui/material";

import OverflowTooltipCellContent from "resources-management/components/shared/TableCellContent/OverflowTooltipCellContent/OverflowTooltipCellContent";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import {
  getIncidencesRowColor,
  getStateRowColor,
} from "resources-management/utils/rows-background-color/rows-background-color.utils";
import {
  ChargeToPatientTableColumn,
  ChargeToPatientTableRow,
} from "../charge-to-patient-table.model";

interface ChargeToPatientTableRowProps {
  row: ChargeToPatientTableRow;
  columns: ChargeToPatientTableColumn[];
  parentRowId?: string;
  isRowIdOpen: { [key: string]: boolean };
  setIsRowIdOpen: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

const ChargeToPatientTableRowComponent = ({
  row,
  columns,
  parentRowId,
  isRowIdOpen,
  setIsRowIdOpen,
}: ChargeToPatientTableRowProps) => {
  useEffect(() => {
    if (!parentRowId) {
      setIsRowIdOpen((prevIsRowIdOpen) => ({
        ...prevIsRowIdOpen,
        [row.id]: prevIsRowIdOpen[row.id] ? prevIsRowIdOpen[row.id] : false,
      }));
    }
  }, [parentRowId, row.id, setIsRowIdOpen]);

  const {
    backgroundColor,
    disabled,
    id: incidenceId,
  } = row.incidence.length
    ? getIncidencesRowColor(row.incidence)
    : getStateRowColor(row.state);

  return (
    <TableRow
      sx={{
        display:
          isRowIdOpen[parentRowId as string] || !parentRowId ? "" : "none",
      }}
    >
      {columns.map(
        ({ id, format, width, align, additionalIconContent, cellContent }) => {
          const cellValue = row[id];
          const cell: ContentCell = {
            id,
            incidence: incidenceId,
            content: format ? format(cellValue) : cellValue,
            rowId: row.id,
          };
          const additonalContent =
            additionalIconContent &&
            additionalIconContent(
              (Array.isArray(cellValue) ? cellValue : [cellValue]) as
                | BookingTrackingState[]
                | BookingTrackingIncidence[]
            );
          return (
            <TableCell
              key={`${row.id}_${id}`}
              align={align}
              width={width}
              sx={{
                minWidth: width,
                maxWidth: width,
                backgroundColor: parentRowId ? "" : backgroundColor,
                color: disabled ? colorPalette.rows.disabled : "",
              }}
              size="small"
            >
              {cellContent ? (
                cellContent(cell, additonalContent)
              ) : (
                <OverflowTooltipCellContent
                  content={cell.content as string | number}
                  id={id}
                />
              )}
            </TableCell>
          );
        }
      )}
    </TableRow>
  );
};

export default ChargeToPatientTableRowComponent;
