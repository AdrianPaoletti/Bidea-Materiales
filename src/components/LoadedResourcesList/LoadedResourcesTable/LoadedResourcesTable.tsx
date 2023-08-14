import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
  FullBookingTrackingDTO,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import EditIcon from "@mui/icons-material/Edit";
import JoinLeftIcon from "@mui/icons-material/JoinLeft";
import WarningIcon from "@mui/icons-material/Warning";
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

import DeleteConfirmation from "resources-management/components/shared/DeleteConfirmation/DeleteConfirmation";
import OverflowTooltipCellContent from "resources-management/components/shared/TableCellContent/OverflowTooltipCellContent/OverflowTooltipCellContent";
import { ROWS_PER_PAGE_OPTIONS } from "resources-management/core/constants/constants";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import {
  getIncidencesRowColor,
  getStateRowColor,
} from "resources-management/utils/rows-background-color/rows-background-color.utils";
import { checkedStates } from "../../../utils/loaded-resources-list/loaded-resources-list.utils";
import getLoadedResourcesTableColumns from "../../../utils/loaded-resources-list/loaded-resources-table-columns";
import MergeBookingTracking from "../MergeBoookingTracking/MergeBookingTracking";
import {
  LoadedResourcesRowMenuItems,
  LoadedResourcesTableRow,
} from "./loaded-resources-table.model";

import styles from "./LoadedResourcesTable.module.scss";

interface ResourcesTableProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  resourcesData: FullBookingTrackingDTO[];
  tableRows: LoadedResourcesTableRow[];
  tableRowsTotalLength: number;
  resourcesCategories: ResourceCategoryDTO[];
  handleMerge: (
    id: string,
    selectedRow: LoadedResourcesTableRow,
    mergeCause: BookingTrackingIncidence | undefined
  ) => Promise<void>;
  handleDelete: (id: string) => void;
  formatResourcesData: (
    resourcesData: FullBookingTrackingDTO[]
  ) => LoadedResourcesTableRow[];
}

const LoadedResourcesTable = ({
  tableRows,
  tableRowsTotalLength,
  resourcesData,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  resourcesCategories,
  handleDelete,
  handleMerge,
  formatResourcesData,
}: ResourcesTableProps) => {
  const [isMergeModalOpen, setIsMergeModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const translationResponse = useTranslation(["common"]);
  const { t } = translationResponse;
  const loadedResourcesRowMenuItems: LoadedResourcesRowMenuItems[] = [
    {
      label: "merge_material",
      action: (rowId: string) => {
        setSelectedRowId(rowId);
        setIsMergeModalOpen(true);
      },
      icon: () => <JoinLeftIcon fontSize="small" />,
    },
    {
      label: "edit_state",
      action: (rowId: string) => console.log(rowId),
      icon: () => <EditIcon fontSize="small" />,
    },
    {
      label: "register_incident",
      action: (rowId: string) => console.log(rowId),
      icon: () => <WarningIcon fontSize="small" />,
    },
  ];

  const columns = getLoadedResourcesTableColumns(
    resourcesCategories,
    translationResponse,
    loadedResourcesRowMenuItems,
    (rowId: string) => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(rowId);
    }
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
        {tableRows && (
          <Table stickyHeader aria-label="loaded-resources-table">
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
                        width,
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
                        width,
                        align,
                        paddingLeft,
                        paddingRight,
                        showCheckBox,
                        additionalIconContent,
                        cellContent,
                        menuOptions,
                      }) => {
                        const cellValue = row[id];
                        const cell: ContentCell = {
                          id,
                          showCheckBox,
                          incidence: incidenceId,
                          boxChecked: checkedStates.includes(row.state?.id),
                          content: format ? format(cellValue) : cellValue,
                          rowId: row.id,
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
                              cellContent(
                                cell,
                                additonalContent,
                                menuOptions || []
                              )
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
      <MergeBookingTracking
        isOpen={isMergeModalOpen}
        setIsOpen={setIsMergeModalOpen}
        handleMerge={handleMerge}
        columns={columns.slice(0, -1)}
        selectedRow={
          tableRows.find(
            ({ id }) => id === selectedRowId
          ) as LoadedResourcesTableRow
        }
        formatedResourcesData={formatResourcesData(resourcesData)}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        columns={columns.slice(0, -1)}
        row={tableRows.find(({ id }) => id === selectedRowId)}
        handleDelete={() => {
          handleDelete(selectedRowId);
          setSelectedRowId("");
          setIsDeleteModalOpen(false);
        }}
      />
    </Box>
  );
};

export default LoadedResourcesTable;
