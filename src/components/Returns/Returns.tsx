import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  BarcodeReadingDTO,
  FullBookingTrackingDTO,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box } from "@mui/material";

import { LoadedResourcesReturnsFilters } from "resources-management/core/models/filters.model";
import { SelectedResourcesCategories } from "resources-management/core/models/selected-resources-categories.model";
import usePrevious from "../../core/hooks/use-previous";
import { ActiveFilters } from "../../core/models/active-filters.model";
import { followedMaterialsApi } from "../../core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import { updateTrackingRequestState } from "../../core/services/tracking-requests/tracking-requests.service";
import ResourcesManagementContext from "../../core/store/context/ResourcesManagementContext";
import { snackbarActions } from "../../core/store/redux/snackbar/snackbar.actions";
import {
  bookingTrackingsToTableRows,
  getReturnsFilters,
  matchReadingWithTracking,
  unReturnableStates,
} from "../../utils/returns/returns.utils";
import ChargeToPatient from "../shared/ChargeToPatient/ChargeToPatient";
import EmptyContent from "../shared/EmptyContent/EmptyContent";
import FiltersHeader from "../shared/FiltersHeader/FiltersHeader";
import InterventionInfo from "../shared/InterventionInfo/InterventionInfo";
import SearchBar from "../shared/SearchBar/SearchBar";
import { ContainedButton } from "../shared/UI/Buttons";
import { ReturnsTableRow } from "./ReturnsTable/returns-table.model";
import ReturnsTable from "./ReturnsTable/ReturnsTable";

import styles from "./Returns.module.scss";

export interface ReturnsProps {
  resourcesCategories: ResourceCategoryDTO[];
}

const Returns = ({ resourcesCategories }: ReturnsProps) => {
  const dispatch = useDispatch();
  const { interventionData, setInterventionData } = useContext(
    ResourcesManagementContext
  );
  const [isChargeToPatientModalOpen, setIsChargeToPatientModalOpen] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [tableRowsTotalLength, setTableTotalLength] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableRows, setTableRows] = useState<ReturnsTableRow[]>([]);
  const [resourcesData, setResourcesData] = useState<FullBookingTrackingDTO[]>(
    []
  );
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    refference: "",
    nameDescription: "",
  });
  const prevActiveFilters = usePrevious(activeFilters);

  const getReturnsTableRows = useCallback(async () => {
    try {
      const resourcesDataResponse = (
        await followedMaterialsApi.queryBookingTrackings({
          queryBookingTrackingsRequest: {
            pagination: { page: 0, offset: 10 },
            filters: {
              hubInternalCode: interventionData.hub,
              interventionRequestCode: interventionData.requestCode,
            },
          },
        })
      ).filter((row) => !unReturnableStates.includes(row.state.id));

      setPage(0);
      setResourcesData(resourcesDataResponse);
      setTableRows(bookingTrackingsToTableRows(resourcesDataResponse));
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

  const filterRows = useCallback(
    (
      filters: LoadedResourcesReturnsFilters[],
      formatedTableRows: ReturnsTableRow[]
    ) =>
      filters.reduce((resultData, { id, filterAction }) => {
        const filterValue = activeFilters[id as keyof ActiveFilters];
        if (filterValue.length) {
          return resultData.filter(
            filterAction(filterValue as SelectedResourcesCategories[] & string)
          );
        }
        return resultData;
      }, formatedTableRows),
    [activeFilters]
  );

  const filters: LoadedResourcesReturnsFilters[] = useMemo(
    getReturnsFilters,
    []
  );

  useEffect(() => {
    if (prevActiveFilters !== activeFilters) {
      setPage(0);
    }
    const filteredRows = filterRows(
      filters,
      bookingTrackingsToTableRows(resourcesData)
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

  useEffect(() => {
    getReturnsTableRows();
  }, [getReturnsTableRows]);

  const handleBarcodeReading = async (barcodeReadingDTO: BarcodeReadingDTO) => {
    const found = matchReadingWithTracking(resourcesData, barcodeReadingDTO);
    if (found) {
      try {
        await updateTrackingRequestState(found, "PRE_WAREHOUSE_DEVOLUTION");
        dispatch(
          snackbarActions.setSnackbarMessage(
            "common:reading_done_successfully",
            "common:reading_was_successful",
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
            4000
          )
        );
      }
      return;
    } else {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:unknown_element",
          "common:no_item_list_matches_scanned_item",
          "warning",
          4000
        )
      );
    }
    await getReturnsTableRows();
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
          />
          <ReturnsTable
            tableRows={tableRows}
            tableRowsTotalLength={tableRowsTotalLength}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            resourcesCategories={resourcesCategories}
          />
          <Box
            className={`${styles["returns__charge-patient"]} u-margin-bottom-medium`}
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
              onChargedToPatient={getReturnsTableRows}
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

export default Returns;
