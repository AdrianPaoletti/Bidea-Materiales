import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";

import { AppState } from "resources-management/core/store/redux";
import { resourcesApi } from "../core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import LoadedResourcesList from "./LoadedResourcesList/LoadedResourcesList";
import { MaterialsItems } from "./main-component.model";
import PreloadedResources from "./PreloadedResources/PreloadedResources";
import Reports from "./Reports/Reports";
import Returns from "./Returns/Returns";
import Navbar from "./shared/Navbar/Navbar";
import SnackbarAlert from "./shared/SnackbarAlert/SnackbarAlert";

const MainComponent = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const snackbarState = useSelector((state: AppState) => state.snackbar);
  const [tabValue, setTabValue] = useState<string>("resources_preload");
  const [resourcesCategories, setResourcesCategories] = useState<
    ResourceCategoryDTO[]
  >([]);

  useEffect(() => {
    getResourcesCategories();
  }, []);

  const getResourcesCategories = async (): Promise<void> => {
    try {
      const resourcesCategories = await resourcesApi.getAllCategories();
      setResourcesCategories(resourcesCategories);
    } catch (error) {
      throw new Error("Error getting the resource's categories: " + error);
    }
  };

  const materialsItems: MaterialsItems[] = [
    {
      label: "resources_preload",
      component: (
        <PreloadedResources resourcesCategories={resourcesCategories} />
      ),
    },
    {
      label: "loaded_resources_list",
      component: (
        <LoadedResourcesList resourcesCategories={resourcesCategories} />
      ),
    },
    {
      label: "returns",
      component: <Returns resourcesCategories={resourcesCategories} />,
    },
    /*     {
      label: "incidents",
      component: <p>{t("common:incidents")}</p>,
    }, */
    {
      label: "reports",
      component: <Reports resourcesCategories={resourcesCategories} />,
    },
  ];

  return (
    <main className="landing">
      <SnackbarAlert snackbarState={snackbarState} dispatch={dispatch} />
      <Navbar
        tabValue={tabValue}
        setTabValue={setTabValue}
        materialsItemsLabels={materialsItems.map(({ label }) => label)}
      />
      {materialsItems.map(
        ({ label, component }) =>
          label === tabValue && (
            <section
              className="landing__page"
              role="tabpanel"
              aria-labelledby={`item_materials_${label}`}
              key={label}
            >
              {component}
            </section>
          )
      )}
    </main>
  );
};

export default MainComponent;
