import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";

import ActionIconButtonsCellContent from "resources-management/components/shared/TableCellContent/ActionIconButtonsCellContent/ActionIconButtonsCellContent";
import CheckboxCellContent from "resources-management/components/shared/TableCellContent/CheckboxCellContent/CheckboxCellContent";
import QuantityCellContent from "resources-management/components/shared/TableCellContent/QuantityCellContent/QuantityCellContent";
import { ContentCell } from "resources-management/core/models/content-cell.model";
import { NameDescription } from "resources-management/core/models/description-name.model";
import {
  PreloadedResoucesTableColumn,
  PreLoadedResourcesTableRowValues,
} from "../../components/PreloadedResources/PreloadedResourcesTable/preloaded-resources-table.model";

export const getPreLoadedResourcesTableColumns = (
  resourcesCategories: ResourceCategoryDTO[],
  handleDeleteClick: (rowId: string) => void,
  isColumnsModal: boolean = false
): PreloadedResoucesTableColumn[] => [
  {
    id: "nameDescription",
    label: "name_description",
    align: "left",
    width: "46rem",
    paddingLeft: "4rem",
    cellContent: ({
      content,
      showCheckBox,
      isBooked,
      isAvailable,
    }: ContentCell) => (
      <CheckboxCellContent
        showCheckBox={showCheckBox}
        maxWidth={"46rem"}
        nameDescription={content as NameDescription[]}
        booked={isBooked}
        available={isAvailable}
      />
    ),
  },
  {
    id: "quantity",
    label: "quantity",
    align: "right",
    width: "20rem",
    ...(!isColumnsModal && {
      cellContent: ({ content }: ContentCell) => (
        <QuantityCellContent content={content as number} />
      ),
    }),
  },
  {
    id: "type",
    label: "type",
    align: "left",
    width: "30rem",
    format: (idType: PreLoadedResourcesTableRowValues): string | undefined =>
      resourcesCategories.find(({ id }) => id === idType)?.name,
  },
  {
    id: "actionIconButtons",
    label: "",
    align: "right",
    width: " 18rem",
    paddingRight: "3rem",
    cellContent: (cell: ContentCell) => (
      <ActionIconButtonsCellContent
        rowId={cell.rowId || `${Math.random()}`}
        menuItems={[]}
        handleDeleteClick={handleDeleteClick}
      />
    ),
  },
];
