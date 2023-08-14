import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteConfirmation from "resources-management/components/shared/DeleteConfirmation/DeleteConfirmation";
import OverflowTooltipCellContent from "resources-management/components/shared/TableCellContent/OverflowTooltipCellContent/OverflowTooltipCellContent";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import { getPreLoadedResourcesTableColumns } from "../../../utils/preloaded-resources/preloaded-resources-table-columns";
import {
  PreloadedResoucesTableColumn,
  PreLoadedResourcesTableRow,
} from "./preloaded-resources-table.model";

import styles from "./PreloadedResourcesTable.module.scss";

interface PreloadedResourcesTableProps {
  tableRows: PreLoadedResourcesTableRow[];
  resourcesCategories: ResourceCategoryDTO[];
  handleDelete?: (id: string) => Promise<void>;
  isTableModal: boolean;
}

const PreloadedResourcesTable = ({
  tableRows,
  resourcesCategories,
  handleDelete,
  isTableModal,
}: PreloadedResourcesTableProps) => {
  const { t } = useTranslation(["common"]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  let columns: PreloadedResoucesTableColumn[] =
    getPreLoadedResourcesTableColumns(
      resourcesCategories,
      (rowId: string) => {
        setIsDeleteModalOpen(true);
        setSelectedRowId(rowId);
      },
      isTableModal
    );
  columns = isTableModal ? columns.slice(0, -1) : columns;

  return (
    <Box className={`${styles["preloaded-resources-table"]}`}>
      <TableContainer
        sx={{
          borderRadius: 0,
          maxHeight: isTableModal
            ? "calc(100vh - 41.5rem)"
            : "calc(100vh - 16.75rem)",
        }}
      >
        <Table stickyHeader aria-label="preloaded-resources-table">
          <TableHead>
            <TableRow>
              {columns.map(
                ({ id, align, width, label, paddingLeft, paddingRight }) => (
                  <TableCell
                    key={id}
                    align={align}
                    width={width}
                    sx={{
                      paddingLeft,
                      paddingRight,
                      backgroundColor: `${colorPalette.secondary.mainLight}`,
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
            {tableRows.map((row, rowIndex) => (
              <TableRow
                key={`${row.id}_${rowIndex}`}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: `${colorPalette.primary.extraLight}`,
                  },
                }}
              >
                {columns.map(
                  ({
                    id,
                    align,
                    paddingLeft,
                    paddingRight,
                    cellContent,
                    format,
                    width,
                  }) => {
                    const cellValue = row[id];
                    const cell: ContentCell = {
                      id,
                      content: format ? format(cellValue) : cellValue,
                      rowId: row.id || "",
                      isAvailable: row.isAvailable,
                      isBooked: row.isBooked,
                    };
                    return (
                      <TableCell
                        key={`${row.id}_${id}`}
                        align={align}
                        width={width}
                        size={isTableModal ? "medium" : "small"}
                        sx={{
                          paddingLeft,
                          paddingRight,
                          backgroundColor: "inherit",
                          maxWidth: width,
                        }}
                      >
                        {cellContent ? (
                          cellContent(cell)
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!isTableModal && handleDelete && (
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
      )}
    </Box>
  );
};

export default PreloadedResourcesTable;
