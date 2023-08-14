import {
  ResourceCategoryDTO,
  ResourceForBookingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";

import {
  PreloadedResourcesFilters,
  SelectedPreloadedResourceValues,
} from "../../components/PreloadedResources/preloaded-resources.model";
import { PreLoadedResourcesTableRow } from "../../components/PreloadedResources/PreloadedResourcesTable/preloaded-resources-table.model";

export const preloadedResourcesFilters: () => PreloadedResourcesFilters[] =
  () => [
    {
      id: "categoryId",
      filterAction:
        (categoryId: SelectedPreloadedResourceValues) =>
        ({ type }: PreLoadedResourcesTableRow) =>
          categoryId === type,
    },
    {
      id: "family",
      filterAction:
        (family: SelectedPreloadedResourceValues) =>
        ({ parentId, id }: PreLoadedResourcesTableRow) =>
          [parentId, id].includes((family as ResourceForBookingDTO).id),
    },
    {
      id: "resource",
      filterAction:
        (resource: SelectedPreloadedResourceValues) =>
        ({ id }: PreLoadedResourcesTableRow) =>
          id === (resource as ResourceForBookingDTO).id,
    },
  ];

export const formatResourceForBooking = (
  bookingRequestsTrackingsData: ResourceForBookingDTO[]
): PreLoadedResourcesTableRow[] =>
  bookingRequestsTrackingsData.map((row) => ({
    id: row.id,
    nameDescription: [
      {
        id: "name",
        value: row.name,
      },
      {
        id: "description",
        value: row.description,
      },
    ],
    quantity: 1,
    type: row.categoryId,
    actionIconButtons: "",
    parentId: row.parentId,
    isAvailable: row.isAvailable,
    isBooked: row.isBooked,
  }));

export const getNumberCategories = (
  resourcesCategories: ResourceCategoryDTO[],
  resources: ResourceForBookingDTO[]
) => {
  let numberOfCategories = {};
  for (const { id: category } of resourcesCategories) {
    numberOfCategories = {
      ...numberOfCategories,
      [category]: resources.filter(({ categoryId }) => category === categoryId)
        .length,
    };
  }
  return numberOfCategories;
};
