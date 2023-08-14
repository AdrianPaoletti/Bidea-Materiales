import { useTranslation } from "react-i18next";

import { InterventionDTO } from "@ikusi/resources-management-api-typescript-fetch";
import { REPORT_SUPPORTED_LANGS } from "@ikusi/surgery-reporting";
import DownloadIcon from "@mui/icons-material/Download";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
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

import { ROWS_PER_PAGE_OPTIONS } from "resources-management/core/constants/constants";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { implantReport } from "resources-management/core/services/reports/generate-implant-report";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import getReportsTableColumns from "../../../utils/reports/reports-table-columns";
import {
  ReportsMenuOptions,
  ReportsTableColumn,
  ReportsTableRow,
} from "./reports-table.model";

import styles from "./ReportsTable.module.scss";

interface ReportsTableProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  tableRows: ReportsTableRow[];
  interventionData: InterventionDTO;
  generateReport: (interventionRequestCode: string) => Promise<void>;
}

const ReportsTable = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  tableRows,
  interventionData: { requestCode, hub },
  generateReport,
}: ReportsTableProps) => {
  const { i18n, t } = useTranslation();

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reportsMenuOptions: ReportsMenuOptions[] = [
    {
      label: "purchase_report",
      action: (interventionRequestCode: string | undefined) =>
        interventionRequestCode && generateReport(interventionRequestCode),
      icon: () => <DownloadIcon fontSize="small" />,
    },
    {
      label: "traceability_report",
      action: (interventionRequestCode: string | undefined) => {
        const row = tableRows.find(
          (t) => `${t.interventionRequestCode}` === interventionRequestCode
        );
        implantReport({
          interventionRequestCode: row?.interventionRequestCode as number,
          interventionHub: row?.hub as string,
          fileName: t(`common:traceability_report`),
          lang: i18n.language as REPORT_SUPPORTED_LANGS,
          withPatient: true,
        });
      },
      icon: () => <SimCardDownloadIcon fontSize="small" />,
    },
    {
      label: "traceability_report_no_patient",
      action: (interventionRequestCode: string | undefined) => {
        const row = tableRows.find(
          (t) => `${t.interventionRequestCode}` === interventionRequestCode
        );
        implantReport({
          interventionRequestCode: row?.interventionRequestCode as number,
          interventionHub: row?.hub as string,
          fileName: t(`common:traceability_report_no_patient`),
          lang: i18n.language as REPORT_SUPPORTED_LANGS,
          withPatient: false,
        });
      },
      icon: () => <SimCardDownloadIcon fontSize="small" />,
    },
  ];

  const columns: ReportsTableColumn[] =
    getReportsTableColumns(reportsMenuOptions);

  return (
    <Box className={`${styles["reports-table"]} u-margin-table`}>
      <TableContainer
        sx={{
          height: "calc(100vh - 35rem)",
        }}
      >
        <Table stickyHeader aria-label="reports-table">
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
                      maxWidth: width,
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
            {tableRows.map((row, rowIndex: number) => (
              <TableRow key={`${rowIndex}`}>
                {columns.map(
                  ({
                    id,
                    format,
                    align,
                    width,
                    paddingLeft,
                    paddingRight,
                    cellContent,
                    menuOptions,
                  }) => {
                    const cellValue = row[id];
                    const cell: ContentCell = {
                      id,
                      content: format ? format(cellValue) : cellValue,
                      rowId: `${row.interventionRequestCode}`,
                    };
                    return (
                      <TableCell
                        key={`${id}`}
                        align={align}
                        width={width}
                        sx={{ paddingLeft, paddingRight, maxWidth: width }}
                        size="small"
                      >
                        {cellContent ? (
                          cellContent(cell, menuOptions || [])
                        ) : (
                          <Typography noWrap component="p">
                            {cell.content as string | number}
                          </Typography>
                        )}
                      </TableCell>
                    );
                  }
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        labelRowsPerPage={`${t("common:rows_per_page")}:`}
        component="div"
        count={tableRows.length}
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
};

export default ReportsTable;
