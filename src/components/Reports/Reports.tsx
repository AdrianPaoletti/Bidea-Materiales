import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
  PurchaseReportItemDateI18n,
  ResourceCategoryDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import DownloadIcon from "@mui/icons-material/Download";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";

import usePrevious from "resources-management/core/hooks/use-previous";
import {
  OperatingRoomCategoriesId,
  ReportQueryFilters,
} from "resources-management/core/models/report-query-filters.model";
import {
  forwardCoreApi,
  forwardMesaDeProgramacionApi,
} from "resources-management/core/services/forward-api-typescript-fetch/forward-api.service";
import generateShoopingReport from "resources-management/core/services/reports/generate-shooping-report";
import { getMainTableRows } from "resources-management/core/services/reports/reports.service";
import { followedMaterialsApi } from "resources-management/core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import { snackbarActions } from "resources-management/core/store/redux/snackbar/snackbar.actions";
import { completeReportInfoFromForward } from "../../utils/reports/reports.utils";
import EmptyContent from "../shared/EmptyContent/EmptyContent";
import { ContainedButton } from "../shared/UI/Buttons";
import { SelectedOperatingRoomsAndCategories } from "./reports.model";
import ReportsSearchFilters from "./ReportsSearchFilters/ReportsSearchFilters";
import { ReportsTableRow } from "./ReportsTable/reports-table.model";
import ReportsTable from "./ReportsTable/ReportsTable";

import styles from "./Reports.module.scss";

export interface ReportsProps {
  resourcesCategories: ResourceCategoryDTO[];
}

const Reports = ({ resourcesCategories }: ReportsProps) => {
  const {
    interventionData,
    clientSession: { centroActual },
  } = useContext(ResourcesManagementContext);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const [operatingRooms, setOperatingRooms] = useState<
    OperatingRoomCategoriesId[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [tableRows, setTableRows] = useState<ReportsTableRow[]>([]);
  const [tableRowsData, setTableRowsData] = useState<ReportsTableRow[]>([]);
  const [reportQueryFilters, setReportQueryFilters] =
    useState<ReportQueryFilters>({
      dateFrom: undefined,
      dateTo: undefined,
      operatingRoomExternalCodes: [],
      interventionRequestCode: undefined,
      categoryIds: [],
      hub: "",
    });
  const [
    selectedOperatingRoomsAndCategories,
    setSelectedOperatingRoomsAndCategories,
  ] = useState<SelectedOperatingRoomsAndCategories>({
    operatingRoomExternalCodes: [],
    categoryIds: [],
  });
  const prevRowsPerPage = usePrevious(rowsPerPage);

  const getOperatingRooms = useCallback(async () => {
    try {
      const operatingRooms = await forwardCoreApi.getQuirofanos({
        centro: +centroActual,
      });
      setOperatingRooms(
        operatingRooms.map(({ CodQuirofano }) => ({
          id: CodQuirofano,
          name: CodQuirofano,
        }))
      );
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_getting_operating_rooms",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  }, [centroActual, dispatch]);

  useEffect(() => {
    if (prevRowsPerPage !== rowsPerPage) {
      setPage(0);
    }
    setTableRows(
      tableRowsData.slice(rowsPerPage * page, rowsPerPage * (page + 1))
    );
  }, [page, prevRowsPerPage, rowsPerPage, tableRowsData]);

  useEffect(() => {
    getOperatingRooms();
  }, [getOperatingRooms]);

  const handleGenerateReport = async (
    name: string,
    interventionRequestCode: string | undefined = undefined
  ) => {
    const {
      dateFrom,
      dateTo,
      interventionRequestCode: interventionCodeFilters,
    } = reportQueryFilters;

    const operatingRoomInternalCodes =
      reportQueryFilters.operatingRoomExternalCodes?.map((ids) => ids.id);
    const categoryIds = reportQueryFilters.categoryIds?.map((ids) => ids.id);

    let purchaseReport = await followedMaterialsApi.getPurchaseReport({
      reportFilters: {
        hub: centroActual,
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(interventionCodeFilters &&
          !interventionRequestCode && {
            interventionRequestCode: interventionCodeFilters.toString(),
          }),
        ...(interventionRequestCode && { interventionRequestCode }),
        ...(operatingRoomInternalCodes?.length && {
          operatingRoomInternalCodes,
        }),
        ...(categoryIds?.length && {
          categoryIds,
        }),
      },
    });
    purchaseReport = await completeReportInfoFromForward(
      purchaseReport,
      forwardMesaDeProgramacionApi
    );
    generateShoopingReport(
      purchaseReport,
      i18n.language as keyof PurchaseReportItemDateI18n,
      name
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const tableRowsData = await getMainTableRows({
        ...reportQueryFilters,
        hub: centroActual,
      });
      setPage(0);
      setTableRowsData(tableRowsData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_filtering_the_search",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  };

  return (
    <section className={`${styles.reports}`}>
      <ReportsSearchFilters
        reportQueryFilters={reportQueryFilters}
        setReportQueryFilters={setReportQueryFilters}
        selectedOperatingRoomsAndCategories={
          selectedOperatingRoomsAndCategories
        }
        setSelectedOperatingRoomsAndCategories={
          setSelectedOperatingRoomsAndCategories
        }
        operatingRooms={operatingRooms}
        resourcesCategories={resourcesCategories}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      {tableRows.length ? (
        <>
          <ReportsTable
            tableRows={tableRows}
            interventionData={interventionData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            generateReport={(interventionCode: string) =>
              handleGenerateReport("Informe de compras", interventionCode)
            }
          />
          <div
            className={`${styles["reports__buttons"]} u-margin-bottom-medium`}
          >
            <ContainedButton
              label="generate_overall_report"
              icon={<DownloadIcon fontSize="small" color="inherit" />}
              onClickHandler={() => handleGenerateReport("Informe global")}
            />
          </div>
        </>
      ) : (
        <EmptyContent
          text={"period_not_yet_selected"}
          icon={<MonitorHeartOutlinedIcon color="inherit" fontSize="inherit" />}
          height={"calc(100vh - 20rem)"}
        />
      )}
    </section>
  );
};

export default Reports;
