import React, { useEffect, useState } from "react";

import { BookingTrackingIncidence } from "@ikusi/resources-management-api-typescript-fetch";
import JoinLeftIcon from "@mui/icons-material/JoinLeft";
import { Box } from "@mui/material";

import MergeMaterialCellContent from "resources-management/components/shared/TableCellContent/MergeMaterialCellContent/MergeMaterialCellContent";
import ModalWrapper from "../../shared/ModalWrapper/ModalWrapper";
import {
  LoadedResourcesTableColumn,
  LoadedResourcesTableRow,
} from "../LoadedResourcesTable/loaded-resources-table.model";
import MergeBookingTrackingTable from "./MergeBookingTrackingTable/MergeBookingTrackingTable";

interface MergeBookingTrackingProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleMerge: (
    id: string,
    selectedRow: LoadedResourcesTableRow,
    mergeCause: BookingTrackingIncidence | undefined
  ) => Promise<void>;
  formatedResourcesData: LoadedResourcesTableRow[];
  selectedRow: LoadedResourcesTableRow;
  columns: LoadedResourcesTableColumn[];
}

const MergeBookingTracking = ({
  isOpen,
  setIsOpen,
  formatedResourcesData,
  handleMerge,
  selectedRow,
  columns,
}: MergeBookingTrackingProps) => {
  const [mergeCause, setMergeCause] = useState<
    BookingTrackingIncidence | undefined
  >(undefined);
  const [mergeableData, setMergeableData] = useState<LoadedResourcesTableRow[]>(
    []
  );

  const columnsMergeBookingTracking: LoadedResourcesTableColumn[] = [
    ...columns,
    {
      id: "actionIconButtons",
      label: "",
      align: "right",
      width: "18rem",
      cellContent: ({ rowId }) => (
        <MergeMaterialCellContent
          handleClick={() => handleClick(rowId as string)}
        />
      ),
    },
  ];

  useEffect(() => {
    const mergeIncidenceCause = selectedRow?.incidence.find(({ id }) =>
      ["MISSING_RESOURCE", "MISSING_BARCODE_READING"].includes(id)
    );
    const filteredMergeableData = formatedResourcesData.filter(
      ({ incidence }) => {
        if (mergeCause?.id === "MISSING_BARCODE_READING") {
          return incidence.some(({ id }) => id === "MISSING_RESOURCE");
        }
        return incidence.some(({ id }) => id === "MISSING_BARCODE_READING");
      }
    );
    setMergeCause(mergeIncidenceCause);
    setMergeableData(filteredMergeableData);
  }, [formatedResourcesData, mergeCause?.id, selectedRow?.incidence]);

  const tablesData: {
    title: string;
    rows: LoadedResourcesTableRow[];
    columns: LoadedResourcesTableColumn[];
  }[] = [
    {
      title: "material_to_be_merge",
      rows: selectedRow ? [selectedRow] : [],
      columns,
    },
    {
      title: "mergeable_material",
      rows: mergeableData,
      columns: columnsMergeBookingTracking,
    },
  ];

  const handleClick = async (id: string) => {
    handleMerge(id, selectedRow, mergeCause);
    setIsOpen(false);
  };

  return (
    <ModalWrapper
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      headerTitle={"merge_material"}
      icon={<JoinLeftIcon fontSize="inherit" color="inherit" />}
    >
      <Box component={"div"} className="u-margin-top-medium">
        {tablesData.map(({ title, rows, columns }, tableDataIndex) => (
          <MergeBookingTrackingTable
            key={tableDataIndex}
            title={title}
            rows={rows}
            columns={columns}
          />
        ))}
      </Box>
    </ModalWrapper>
  );
};

export default MergeBookingTracking;
