import React from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { colorPalette } from "resources-management/styles/themes/color-palette";
import getChargeToPatientTableColumns from "../../../../utils/charge-to-patient/charge-to-patient-table-columns";
import { ChargeToPatientTableRow } from "./charge-to-patient-table.model";
import ChargeToPatientTableRowComponent from "./ChargeToPatientTableRow/ChargeToPatientTableRow";

interface ChargeToPatientTableProps {
  tableRows: ChargeToPatientTableRow[];
  handleDelete: (rowId: string) => void;
  isRowIdOpen: { [key: string]: boolean };
  setIsRowIdOpen: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

const ChargeToPatientTable = ({
  tableRows,
  handleDelete,
  isRowIdOpen,
  setIsRowIdOpen,
}: ChargeToPatientTableProps) => {
  const translationResponse = useTranslation();
  const { t } = translationResponse;

  const columns = getChargeToPatientTableColumns(
    translationResponse,
    handleDelete,
    false,
    true
  );

  return (
    <TableContainer
      sx={{
        overflow: "auto",
        borderRadius: "0.75rem",
        height: "47.3rem",
        maxHeight: "47.3rem",
      }}
    >
      <Table stickyHeader aria-label="charge-to-patient-table">
        <TableHead>
          <TableRow>
            {columns.map(({ id, align, width, label }) => (
              <TableCell
                key={id}
                align={align}
                width={width}
                sx={{
                  maxWidth: width,
                  backgroundColor: colorPalette.secondary.mainLight,
                }}
              >
                <Typography noWrap fontWeight={500}>
                  {t(`common:${label}`)}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows.map((row) => {
            const columnsMain = getChargeToPatientTableColumns(
              translationResponse,
              handleDelete,
              true,
              false,
              row.id,
              isRowIdOpen,
              setIsRowIdOpen
            );
            return (
              <React.Fragment key={row.id}>
                <ChargeToPatientTableRowComponent
                  row={row}
                  columns={columnsMain}
                  isRowIdOpen={isRowIdOpen}
                  setIsRowIdOpen={setIsRowIdOpen}
                />
                {row.children?.map((rowChildren) => (
                  <ChargeToPatientTableRowComponent
                    row={rowChildren}
                    parentRowId={row.id}
                    columns={columns}
                    isRowIdOpen={isRowIdOpen}
                    setIsRowIdOpen={setIsRowIdOpen}
                    key={rowChildren.id}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ChargeToPatientTable;
