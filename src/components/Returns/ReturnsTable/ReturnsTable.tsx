import React from "react";
import { useTranslation } from "react-i18next";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import OverflowTooltipCellContent from "resources-management/components/shared/TableCellContent/OverflowTooltipCellContent/OverflowTooltipCellContent";
import { ROWS_PER_PAGE_OPTIONS } from "resources-management/core/constants/constants";
import {
  getIncidencesRowColor,
  getStateRowColor,
} from "resources-management/utils/rows-background-color/rows-background-color.utils";
import { ContentCell } from "../../../core/models/content-cell.model";
import { colorPalette } from "../../../styles/themes/color-palette";
import { checkedStates } from "../../../utils/returns/returns.utils";
import { getReturnTableColumns } from "../../../utils/returns/returns-table-columns";
import { ReturnsTableRow } from "./returns-table.model";

import styles from "./ReturnsTable.module.scss";

interface ReturnsTableProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  tableRows: ReturnsTableRow[];
  tableRowsTotalLength: number;
  resourcesCategories: ResourceCategoryDTO[];
}

export default function ReturnsTable({
  tableRows,
  tableRowsTotalLength,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  resourcesCategories,
}: ReturnsTableProps) {
  const translationResponse = useTranslation();
  const { t } = translationResponse;

  const columns = getReturnTableColumns(
    resourcesCategories,
    translationResponse
  );
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box className={`${styles["resources-table"]} u-margin-table`}>
      <TableContainer
        sx={{
          height: "calc(100vh - 45.9rem)",
        }}
      >
        <Table stickyHeader aria-label="returns-table">
          <TableHead>
            <TableRow>
              {columns.map(
                ({ id, align, width, label, paddingLeft, paddingRight }) => (
                  <TableCell
                    key={id}
                    align={align}
                    width={width}
                    sx={{
                      borderBottom: `2px solid ${colorPalette.primary.light}`,
                      paddingLeft,
                      paddingRight,
                    }}
                  >
                    <Typography noWrap fontWeight={500}>
                      {t(`common:${label}`)}
                    </Typography>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => {
              const {
                backgroundColor,
                disabled,
                id: incidenceId,
              } = row.incidence.length
                ? getIncidencesRowColor(row.incidence)
                : getStateRowColor(row.state);
              return (
                <TableRow key={row.id}>
                  {columns.map(
                    ({
                      id,
                      format,
                      align,
                      width,
                      paddingLeft,
                      paddingRight,
                      showCheckBox,
                      additionalIconContent,
                      cellContent,
                    }) => {
                      const cellValue = row[id];
                      const cell: ContentCell = {
                        id,
                        showCheckBox,
                        boxChecked: checkedStates.includes(row.state?.id),
                        content: format ? format(cellValue) : cellValue,
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
                          key={`${row.id}_${id}`}
                          align={align}
                          width={width}
                          sx={{
                            paddingLeft,
                            paddingRight,
                            maxWidth: width,
                            backgroundColor,
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
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        labelRowsPerPage={`${t("common:rows_per_page")}:`}
        component="div"
        count={tableRowsTotalLength}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(
          event: React.MouseEvent<HTMLButtonElement> | null,
          newPage: number
        ) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
