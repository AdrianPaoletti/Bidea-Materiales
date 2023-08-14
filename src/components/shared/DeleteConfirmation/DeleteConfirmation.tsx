import { useTranslation } from "react-i18next";

import {
  BookingTrackingIncidence,
  BookingTrackingState,
} from "@ikusi/resources-management-api-typescript-fetch";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import {
  LoadedResourcesTableColumn,
  LoadedResourcesTableRow,
} from "resources-management/components/LoadedResourcesList/LoadedResourcesTable/loaded-resources-table.model";
import {
  PreloadedResoucesTableColumn,
  PreLoadedResourcesTableRow,
} from "resources-management/components/PreloadedResources/PreloadedResourcesTable/preloaded-resources-table.model";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import { checkedStates } from "resources-management/utils/loaded-resources-list/loaded-resources-list.utils";
import {
  getIncidencesRowColor,
  getStateRowColor,
} from "resources-management/utils/rows-background-color/rows-background-color.utils";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import OverflowTooltipCellContent from "../TableCellContent/OverflowTooltipCellContent/OverflowTooltipCellContent";
import { ContainedButton, TextButton } from "../UI/Buttons";
import { Columns, Row } from "./delete-confirmation.model";

import styles from "./DeleteConfirmation.module.scss";

export interface DeleteConfirmationProps {
  columns: LoadedResourcesTableColumn[] | PreloadedResoucesTableColumn[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: LoadedResourcesTableRow | PreLoadedResourcesTableRow | undefined;
  handleDelete: () => void;
}

const DeleteConfirmation = ({
  columns,
  isOpen,
  setIsOpen,
  row,
  handleDelete,
}: DeleteConfirmationProps) => {
  const { t } = useTranslation(["common"]);
  const rowTyped = row as Row;
  let colors = { backgroundColor: "", disabled: false, idIncidence: "" };

  if (rowTyped?.incidence || rowTyped?.state) {
    const { backgroundColor, disabled, id } = rowTyped?.incidence.length
      ? getIncidencesRowColor(rowTyped.incidence)
      : getStateRowColor(rowTyped.state);
    colors = {
      backgroundColor,
      disabled: disabled || false,
      idIncidence: id as string,
    };
  }

  return (
    <ModalWrapper
      headerTitle={"removed_preload_resource"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      icon={<DeleteOutlineOutlinedIcon fontSize="inherit" color="inherit" />}
      showInterventionInfo={false}
      height={"fit-content"}
    >
      <Box className={`${styles["delete-confirmation"]} u-padding-medium`}>
        <div>
          <h2 className="heading-secondary u-margin-bottom-small-medium">
            {t(`common:want_to_remove_resource_from_list`)}
          </h2>
          {row && (
            <TableContainer sx={{ overflow: "auto", borderRadius: "0.75rem" }}>
              <Table aria-label="delete-confirmation-table">
                <TableBody>
                  <TableRow>
                    {(columns as Columns).map(
                      ({
                        id,
                        format,
                        align,
                        width,
                        additionalIconContent,
                        showCheckBox,
                        cellContent,
                      }) => {
                        const cellValue = rowTyped[id];
                        const cell: ContentCell = {
                          id,
                          content: format ? format(cellValue) : cellValue,
                          rowId: rowTyped?.id,
                          showCheckBox,
                          boxChecked: checkedStates.includes(
                            rowTyped.state?.id
                          ),
                          incidence: colors.idIncidence,
                          isAvailable: rowTyped.isAvailable,
                          isBooked: rowTyped.isBooked,
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
                              backgroundColor:
                                colors.backgroundColor ||
                                colorPalette.primary.extraLight,
                              color: colors.disabled
                                ? colorPalette.rows.disabled
                                : "",
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
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
        <div
          className={`${styles["delete-confirmation__buttons"]} u-margin-top-medium`}
        >
          <TextButton
            label={"cancel"}
            onClickHandler={() => setIsOpen(false)}
          />
          <ContainedButton
            label={"delete"}
            onClickHandler={() => handleDelete()}
          />
        </div>
      </Box>
    </ModalWrapper>
  );
};

export default DeleteConfirmation;
