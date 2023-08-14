import { useTranslation } from "react-i18next";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import OverflowTooltipCellContent from "resources-management/components/shared/TableCellContent/OverflowTooltipCellContent/OverflowTooltipCellContent";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import {
  getIncidencesRowColor,
  getStateRowColor,
} from "resources-management/utils/rows-background-color/rows-background-color.utils";
import { checkedStates } from "../../../../utils/loaded-resources-list/loaded-resources-list.utils";
import {
  LoadedResourcesTableColumn,
  LoadedResourcesTableRow,
} from "../../LoadedResourcesTable/loaded-resources-table.model";

interface MergeBookingTrackingTableProps {
  title: string;
  rows: LoadedResourcesTableRow[];
  columns: LoadedResourcesTableColumn[];
}

const MergeBookingTrackingTable = ({
  title,
  rows,
  columns,
}: MergeBookingTrackingTableProps) => {
  const { t } = useTranslation(["common"]);

  return (
    <Box component={"div"} className="u-margin-table">
      <h2 className="heading-secondary u-margin-bottom-small-medium">
        {t(`common:${title}`)}
      </h2>

      <TableContainer
        sx={{
          overflow: "auto",
          borderRadius: "0.75rem",
          maxHeight: "calc(100vh - 53.5rem)",
        }}
      >
        {!!rows.length && (
          <Table aria-label="merge-booking-tracking-table">
            <TableBody>
              {rows.map((row) => {
                const {
                  backgroundColor,
                  disabled,
                  id: incidenceId,
                } = row?.incidence.length
                  ? getIncidencesRowColor(row.incidence)
                  : getStateRowColor(row.state);
                return (
                  <TableRow key={row.id}>
                    {columns.map(
                      ({
                        id,
                        format,
                        align,
                        additionalIconContent,
                        showCheckBox,
                        cellContent,
                        width,
                      }) => {
                        const cellValue = row[id];
                        const cell: ContentCell = {
                          id,
                          content: format ? format(cellValue) : cellValue,
                          rowId: row?.id,
                          showCheckBox,
                          boxChecked: checkedStates.includes(row.state?.id),
                          incidence: incidenceId,
                        };
                        const additonalContent =
                          additionalIconContent &&
                          additionalIconContent(
                            (Array.isArray(cellValue)
                              ? cellValue
                              : [cellValue]) as
                              | BookingTrackingState[]
                              | BookingTrackingIncidence[]
                          );
                        return (
                          <TableCell
                            key={id}
                            align={align}
                            width={width}
                            size="small"
                            sx={{
                              maxWidth: width,
                              backgroundColor,
                              color: disabled ? colorPalette.rows.disabled : "",
                            }}
                          >
                            {cellContent ? (
                              cellContent(cell, additonalContent, [])
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
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default MergeBookingTrackingTable;
