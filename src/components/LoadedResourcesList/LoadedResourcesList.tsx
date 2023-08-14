import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  BarcodeReadingDTO,
  BookingTrackingIncidence,
  FullBookingTrackingDTO,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box } from "@mui/material";

import usePrevious from "resources-management/core/hooks/use-previous";
import { ActiveFilters } from "resources-management/core/models/active-filters.model";
import { LoadedResourcesReturnsFilters } from "resources-management/core/models/filters.model";
import { newOrUpdateTrackingRequest } from "resources-management/core/services/loaded-resources-list/loaded-resources-list.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import { followedMaterialsApi } from "../../core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import { snackbarActions } from "../../core/store/redux/snackbar/snackbar.actions";
import {
  chargedState,
  formatResourcesData,
  loadedResourcesListFilters,
} from "../../utils/loaded-resources-list/loaded-resources-list.utils";
import ChargeToPatient from "../shared/ChargeToPatient/ChargeToPatient";
import EmptyContent from "../shared/EmptyContent/EmptyContent";
import FiltersHeader from "../shared/FiltersHeader/FiltersHeader";
import InterventionInfo from "../shared/InterventionInfo/InterventionInfo";
import SearchBar from "../shared/SearchBar/SearchBar";
import { ContainedButton } from "../shared/UI/Buttons";
import { LoadedResourcesTableRow } from "./LoadedResourcesTable/loaded-resources-table.model";
import LoadedResourcesTable from "./LoadedResourcesTable/LoadedResourcesTable";

import styles from "./LoadedResourcesList.module.scss";

export interface LoadedResourcesListProps {
  resourcesCategories: ResourceCategoryDTO[];
}

const LoadedResourcesList = ({
  resourcesCategories,
}: LoadedResourcesListProps) => {
  const dispatch = useDispatch();
  const { interventionData, setInterventionData } = useContext(
    ResourcesManagementContext
  );
  const [isChargeToPatientModalOpen, setIsChargeToPatientModalOpen] =
    useState<boolean>(false);
  const [tableRowsTotalLength, setTableTotalLength] = useState<number>(0);
  const [tableRows, setTableRows] = useState<LoadedResourcesTableRow[]>([]);
  const [resourcesData, setResourcesData] = useState<FullBookingTrackingDTO[]>(
    []
  );
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    refference: "",
    nameDescription: "",
  });
  const prevActiveFilters = usePrevious(activeFilters);

  const filters: LoadedResourcesReturnsFilters[] = useMemo(
    loadedResourcesListFilters,
    []
  );

  const filterRows = useCallback(
    (
      filters: LoadedResourcesReturnsFilters[],
      formatedTableRows: LoadedResourcesTableRow[]
    ) =>
      filters.reduce((resultData, { id, filterAction }) => {
        const filterValue = activeFilters[id as keyof ActiveFilters];
        if (filterValue?.length) {
          return resultData.filter(
            filterAction(filterValue)
          );
        }
        return resultData;
      }, formatedTableRows),
    [activeFilters]
  );

  const getLoadedResourcesTableRows = useCallback(async () => {
    try {
      const resourcesDataResponse =
        await followedMaterialsApi.queryBookingTrackings({
          queryBookingTrackingsRequest: {
            filters: {
              hubInternalCode: interventionData.hub,
              interventionRequestCode: interventionData.requestCode,
            },
          },
        });
      setPage(0);
      setResourcesData(resourcesDataResponse);
      setTableRows(formatResourcesData(resourcesDataResponse));
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_loading_materials_bill",
          `${(error as any)?.response?.statusText}`,
          "error",
          3000
        )
      );
    }
  }, [dispatch, interventionData.hub, interventionData.requestCode]);

  useEffect(() => {
    getLoadedResourcesTableRows();
  }, [getLoadedResourcesTableRows]);

  useEffect(() => {
    if (prevActiveFilters !== activeFilters) {
      setPage(0);
    }
    const filteredRows = filterRows(
      filters,
      formatResourcesData(resourcesData)
    );
    setTableTotalLength(filteredRows.length);
    setTableRows(
      filteredRows.slice(rowsPerPage * page, rowsPerPage * (page + 1))
    );
  }, [
    activeFilters,
    filterRows,
    filters,
    resourcesData,
    page,
    rowsPerPage,
    prevActiveFilters,
  ]);

  const handleDelete = async (bookingRequestId: string) => {
    try {
      await followedMaterialsApi.deleteTrackingRequest({ bookingRequestId });
      await getLoadedResourcesTableRows();
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:resource_deleted_successfully",
          "common:resource_removed_from_list",
          "success",
          3000
        )
      );
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_failed_delete_resource",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  };

  const handleMerge = async (
    id: string,
    selectedRow: LoadedResourcesTableRow,
    mergeCause: BookingTrackingIncidence | undefined
  ) => {
    try {
      await followedMaterialsApi.mergeBookingTracking({
        mergeBookingTrackingRequest: {
          idBookingTrackingWithBarcode:
            mergeCause?.id === "MISSING_BARCODE_READING"
              ? id
              : (selectedRow.id),
          idBookingTrackingWithResource:
            mergeCause?.id === "MISSING_BARCODE_READING"
              ? (selectedRow.id)
              : id,
          state: "READY",
        },
      });
      getLoadedResourcesTableRows();
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:material_successfully_merged",
          "common:material_been_successfully_merged",
          "success",
          3000
        )
      );
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_failed_merge_material",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  };

  const handleBarcodeReading = async (barcodeReadingDTO: BarcodeReadingDTO) => {
    try {
      await newOrUpdateTrackingRequest(
        resourcesData.filter((r) => r.state.id === "PLANNED"),
        barcodeReadingDTO,
        interventionData
      );
      await getLoadedResourcesTableRows();
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:reading_done_successfully",
          "common:added_resource_to_the_list",
          "success",
          2000
        )
      );
    } catch (e) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_loading_resource",
          "errors:err_it_seems_error",
          "error",
          2000
        )
      );
    }
  };

  return (
    <Box>
      <section className={styles["intervention-header"]}>
        <div
          className={`${styles["intervention-header__search-bar"]} u-padding-medium`}
        >
          <SearchBar setInterventionData={setInterventionData} />
        </div>
        <InterventionInfo interventionData={interventionData} />
      </section>
      {interventionData.hub !== "-" ? (
        <>
          <FiltersHeader
            onBarcodeReaded={handleBarcodeReading}
            resourcesCategories={resourcesCategories}
            setActiveFilters={setActiveFilters}
            chargeState={chargedState(resourcesData)}
          />
          <LoadedResourcesTable
            resourcesData={resourcesData}
            tableRows={tableRows}
            tableRowsTotalLength={tableRowsTotalLength}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            resourcesCategories={resourcesCategories}
            handleMerge={handleMerge}
            handleDelete={handleDelete}
            formatResourcesData={formatResourcesData}
          />
          <Box
            className={`${styles["loaded-resources__charge-patient"]} u-margin-bottom-medium`}
          >
            <ContainedButton
              label={"impute_to_patient"}
              icon={<PersonAddIcon fontSize="small" color="inherit" />}
              onClickHandler={() => setIsChargeToPatientModalOpen(true)}
              isDisabled={false}
            />
            <ChargeToPatient
              isOpen={isChargeToPatientModalOpen}
              setIsOpen={setIsChargeToPatientModalOpen}
              resourcesData={resourcesData}
              onChargedToPatient={getLoadedResourcesTableRows}
            />
          </Box>
        </>
      ) : (
        <EmptyContent
          text={"no_intervention_selected_yet"}
          icon={<MonitorHeartOutlinedIcon color="inherit" fontSize="inherit" />}
          height={"calc(100vh - 20rem)"}
        />
      )}
    </Box>
  );
};

export default LoadedResourcesList;
