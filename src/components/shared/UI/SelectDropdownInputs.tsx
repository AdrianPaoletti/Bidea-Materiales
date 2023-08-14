import { useTranslation } from "react-i18next";

import { ResourceCategoryDTO } from "@ikusi/resources-management-api-typescript-fetch";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { SelectedOperatingRoomsAndCategories } from "resources-management/components/Reports/reports.model";
import { OperatingRoomCategoriesId } from "resources-management/core/models/report-query-filters.model";

interface SelectedDropdownInputsProps {
  selectedItems: string[];
  menuItems: ResourceCategoryDTO[] | OperatingRoomCategoriesId[];
  isMultiple: boolean;
  isFullWidth: boolean;
  label: string;
  id?: keyof SelectedOperatingRoomsAndCategories;
  handleChange: (event: SelectChangeEvent<string[]>) => void;
  handleDelete?: (
    value: string,
    id?: keyof SelectedOperatingRoomsAndCategories
  ) => void;
}

const SelectDropdownInputs = ({
  selectedItems,
  menuItems,
  isMultiple,
  isFullWidth,
  label,
  handleChange,
  handleDelete,
  id,
}: SelectedDropdownInputsProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <FormControl fullWidth={isFullWidth} focused>
      <InputLabel>{t(`common:${label}`)}</InputLabel>
      <Select
        multiple={isMultiple}
        label={t(`common:${label}`)}
        value={selectedItems}
        name={id}
        input={<OutlinedInput label={t(`common:${label}`)} />}
        onChange={handleChange}
        renderValue={(selected: string[]) => (
          <Box className={`u-margin-left-small`}>
            {isMultiple
              ? selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    onDelete={() => handleDelete && handleDelete(value, id)}
                    sx={{
                      height: "2rem",
                      "& .MuiChip-deleteIcon": {
                        fontSize: "1.6rem",
                      },
                    }}
                  />
                ))
              : selected}
          </Box>
        )}
      >
        {menuItems.map(({ name, id }) => (
          <MenuItem value={name} key={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDropdownInputs;
