import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
  ResourceCategoryDTO,
  ResourceForBookingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import AddIcon from "@mui/icons-material/Add";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import { AutocompleteChangeReason, Box } from "@mui/material";

import {
  deleteResource,
  getAutomatedProposal,
  getFamilies,
  getPreloadedResources,
  getResources,
  postResources,
} from "resources-management/core/services/preloaded-resources/preloaded-resources.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import { snackbarActions } from "resources-management/core/store/redux/snackbar/snackbar.actions";
import {
  formatResourceForBooking,
  getNumberCategories,
  preloadedResourcesFilters,
} from "../../utils/preloaded-resources/preloaded-resources.utils";
import EmptyContent from "../shared/EmptyContent/EmptyContent";
import SearchBar from "../shared/SearchBar/SearchBar";
import { SubmitButton } from "../shared/UI/Buttons";
import TextSearchField from "../shared/UI/TextInputs";
import AutomatedProposal from "./AutomatedProposal/AutomatedProposal";
import {
  PreloadedResourcesFilters,
  PreloadedResourcesOptions,
  SelectedPreloadedResource,
} from "./preloaded-resources.model";
import PreloadedResourcesBlock from "./PreloadedResourcesBlock/PreloadedResourcesBlock";
import { PreLoadedResourcesTableRow } from "./PreloadedResourcesTable/preloaded-resources-table.model";
import PreloadedResourcesTable from "./PreloadedResourcesTable/PreloadedResourcesTable";

import styles from "./PreloadedResources.module.scss";

export interface PreloadedResourcesProps {
  resourcesCategories: ResourceCategoryDTO[];
}

const PreloadedResources = ({
  resourcesCategories,
}: PreloadedResourcesProps) => {
  const preloadedResourcesOptionsInitialValue: PreloadedResourcesOptions = {
    families: [],
    resources: [],
  };
  const selectedPreloadedResourceInitialValue: SelectedPreloadedResource = {
    categoryId: "",
    family: null,
    resource: null,
  };
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const {
    setInterventionData,
    interventionData,
    clientSession: { centroActual },
  } = useContext(ResourcesManagementContext);

  const [resourceForBooking, setResourceForBooking] = useState<
    ResourceForBookingDTO[]
  >([]);
  const [tableRows, setTableRows] = useState<PreLoadedResourcesTableRow[]>([]);
  const [selectedPreloadedResource, setSelectedPreloadedResource] =
    useState<SelectedPreloadedResource>(selectedPreloadedResourceInitialValue);
  const [preloadedResourcesOptions, setPreloadedResourcesOptions] =
    useState<PreloadedResourcesOptions>(preloadedResourcesOptionsInitialValue);
  const [activeFilters, setActiveFilters] = useState<SelectedPreloadedResource>(
    selectedPreloadedResourceInitialValue
  );
  const [filtersOptions, setFiltersOptions] =
    useState<PreloadedResourcesOptions>(preloadedResourcesOptionsInitialValue);
  const [resourcesPrediction, setResourcesPrediction] = useState<
    ResourceForBookingDTO[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleGetPreloadedResources = useCallback(async () => {
    try {
      const preloadedResources = await getPreloadedResources(
        interventionData,
        centroActual
      );
      setResourceForBooking(preloadedResources);
      setTableRows(formatResourceForBooking(preloadedResources));
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_loading_list_of_reservations",
          `${(error as Error)?.message}`,
          "error",
          3000
        )
      );
    }
  }, [centroActual, dispatch, interventionData]);

  const handleGetAutomatedProposal = useCallback(async () => {
    try {
      const resourcesPrediction = await getAutomatedProposal(interventionData);
      setResourcesPrediction(resourcesPrediction);
    } catch (error) {
      console.log(error);
    }
  }, [interventionData]);

  const filterRows = useCallback(
    (
      filters: PreloadedResourcesFilters[],
      formatedTableRows: PreLoadedResourcesTableRow[]
    ) =>
      filters.reduce((resultData, { id, filterAction }) => {
        const filterValue =
          activeFilters[id as keyof SelectedPreloadedResource];
        if (filterValue) {
          return resultData.filter(
            filterAction(filterValue as SelectedPreloadedResource & string)
          );
        }
        return resultData;
      }, formatedTableRows),
    [activeFilters]
  );

  const filters = useMemo(preloadedResourcesFilters, []);

  useEffect(() => {
    const filteredRows = filterRows(
      filters,
      formatResourceForBooking(resourceForBooking)
    );
    setTableRows(filteredRows);
  }, [activeFilters, filterRows, filters, resourceForBooking]);

  useEffect(() => {
    if (interventionData.requestCode) {
      handleGetPreloadedResources();
      handleGetAutomatedProposal();
    }
  }, [
    centroActual,
    handleGetAutomatedProposal,
    handleGetPreloadedResources,
    interventionData,
  ]);

  const handleClick = async (
    categoryId: string,
    selected: SelectedPreloadedResource,
    setSelected: React.Dispatch<
      React.SetStateAction<SelectedPreloadedResource>
    >,
    setOptions: React.Dispatch<React.SetStateAction<PreloadedResourcesOptions>>
  ) => {
    if (selected?.categoryId === categoryId) {
      setSelected(() => ({
        ...selectedPreloadedResourceInitialValue,
        categoryId: "",
      }));
      setOptions(preloadedResourcesOptionsInitialValue);
      return;
    }

    const families = await getFamilies(
      categoryId,
      centroActual,
      interventionData
    );
    setSelected(() => ({
      ...selectedPreloadedResourceInitialValue,
      categoryId,
    }));
    setOptions({
      ...preloadedResourcesOptionsInitialValue,
      ...(families && { families }),
    });
  };

  const handleChange = async (
    familyResourceBooking: ResourceForBookingDTO,
    autocompleteId: string,
    reason: AutocompleteChangeReason,
    setSelected: React.Dispatch<
      React.SetStateAction<SelectedPreloadedResource>
    >,
    setOptions: React.Dispatch<React.SetStateAction<PreloadedResourcesOptions>>
  ) => {
    if (reason === "clear") {
      setSelected((prevSelected) => ({
        ...prevSelected,
        [autocompleteId]: familyResourceBooking,
      }));
      return;
    }
    if (autocompleteId === "family") {
      const resources = await getResources(
        familyResourceBooking.id,
        centroActual,
        interventionData
      );
      setOptions((prevOptions) => ({ ...prevOptions, resources }));
      setSelected((prevSelected) => ({
        ...prevSelected,
        family: familyResourceBooking,
      }));
      return;
    }
    setSelected((prevSelected) => ({
      ...prevSelected,
      resource: familyResourceBooking,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    selectedPreloadedResource?: SelectedPreloadedResource
  ) => {
    event.preventDefault();
    const { family, resource } =
      selectedPreloadedResource as SelectedPreloadedResource;
    try {
      await postResources(
        resource ? resource : (family as ResourceForBookingDTO),
        interventionData,
        centroActual
      );
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:resource_created_successfully",
          "common:resource_been_created_successfully",
          "success",
          3000
        )
      );
      setSelectedPreloadedResource(selectedPreloadedResourceInitialValue);
      setPreloadedResourcesOptions(preloadedResourcesOptionsInitialValue);
      setActiveFilters(selectedPreloadedResourceInitialValue);
      setFiltersOptions(preloadedResourcesOptionsInitialValue);
      handleGetPreloadedResources();
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_creating_resource",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  };

  const handleClickAssignProposal = async (
    resources: ResourceForBookingDTO[]
  ) => {
    try {
      await Promise.all(
        resources.map((resource) =>
          postResources(resource, interventionData, centroActual)
        )
      );
      setTableRows([
        ...tableRows,
        ...formatResourceForBooking(resourcesPrediction),
      ]);
      setIsModalOpen(false);
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:automated_proposal_created_successfully",
          "common:automated_proposal_been_created_successfully",
          "success",
          3000
        )
      );
    } catch (error) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_creating_automated_proposal",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteResource(resourceId, interventionData, centroActual);
      await handleGetPreloadedResources();
      dispatch(
        snackbarActions.setSnackbarMessage(
          "common:resource_deleted_successfully",
          "common:removed_preload_resource",
          "success",
          3000
        )
      );
    } catch (e) {
      dispatch(
        snackbarActions.setSnackbarMessage(
          "errors:err_deleting_resource",
          "errors:err_it_seems_error",
          "error",
          3000
        )
      );
    }
  };

  return (
    <Box component={"section"} className={styles["preloaded-resources"]}>
      <article className={styles["preloaded-resources__container"]}>
        <div className="u-padding-medium">
          <h2 className="heading-secondary u-margin-bottom-small-medium">
            {t("common:intervention_search")}
          </h2>
          <SearchBar setInterventionData={setInterventionData} />
        </div>
        <PreloadedResourcesBlock
          resourcesCategories={resourcesCategories}
          interventionData={interventionData}
          handleClick={handleClick}
          handleChange={handleChange}
          selected={activeFilters}
          setSelected={setActiveFilters}
          options={filtersOptions}
          setOptions={setFiltersOptions}
          categoriesQuantity={getNumberCategories(
            resourcesCategories,
            resourceForBooking
          )}
          title={"filter_resources"}
        />
      </article>
      {interventionData.hub !== "-" ? (
        <article className={styles["preloaded-resources__container"]}>
          <div className={styles["preloaded-resources__resources-column"]}>
            <PreloadedResourcesBlock
              resourcesCategories={resourcesCategories}
              handleClick={handleClick}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              selected={selectedPreloadedResource}
              setSelected={setSelectedPreloadedResource}
              options={preloadedResourcesOptions}
              setOptions={setPreloadedResourcesOptions}
              title={"resources_preload"}
              buttonText={"add_resource"}
            />
            <AutomatedProposal
              resourcesCategories={resourcesCategories}
              proposalTableRows={formatResourceForBooking(resourcesPrediction)}
              handleClick={() => handleClickAssignProposal(resourcesPrediction)}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              categoriesQuantity={getNumberCategories(
                resourcesCategories,
                resourcesPrediction
              )}
            />
            <Box
              component={"div"}
              className={`${styles["preloaded-resources__special-material"]} u-padding-medium`}
            >
              <h3 className="heading-secondary">
                {t("common:add_special_non_standard_material")}
              </h3>
              <TextSearchField label={"Nombre"} icon={<></>} />
              <div
                className={
                  styles["preloaded-resources__special-material-button"]
                }
              >
                <SubmitButton
                  label={"add_special_material"}
                  icon={<AddIcon />}
                  color={"secondary"}
                  padding={"0.7rem 2.5rem"}
                  width={"25.1rem"}
                />
              </div>
            </Box>
          </div>
          <PreloadedResourcesTable
            tableRows={tableRows}
            resourcesCategories={resourcesCategories}
            handleDelete={handleDelete}
            isTableModal={false}
          />
        </article>
      ) : (
        <EmptyContent
          text={"no_intervention_selected_yet"}
          icon={<MonitorHeartOutlinedIcon color="inherit" fontSize="inherit" />}
          height={"calc(100vh - 31.25rem)"}
        />
      )}
    </Box>
  );
};

export default PreloadedResources;
