import { FormEvent, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

import {
  InterventionDTO,
  ResourceCategoryDTO,
  ResourceForBookingDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Box,
  Chip,
  ListItem,
  TextField,
} from "@mui/material";

import { SubmitButton } from "resources-management/components/shared/UI/Buttons";
import { colorPalette } from "resources-management/styles/themes/color-palette";
import { formatStringToDateHour } from "resources-management/utils/date-utils/format-date.utils";
import {
  PreloadedResourcesOptions,
  SelectedPreloadedResource,
} from "../preloaded-resources.model";
import {
  AutoCompleteInputs,
  InterventionDataInformation,
} from "./preloaded-resources-block.model";

import styles from "./PreloadedResourcesBlock.module.scss";

interface PreloadProposalResourcesProps {
  resourcesCategories: ResourceCategoryDTO[];
  options: PreloadedResourcesOptions;
  setOptions: React.Dispatch<React.SetStateAction<PreloadedResourcesOptions>>;
  interventionData?: InterventionDTO;
  title: string;
  selected: SelectedPreloadedResource;
  setSelected: React.Dispatch<React.SetStateAction<SelectedPreloadedResource>>;
  categoriesQuantity?: { [key: string]: number };
  handleClick: (
    categoryId: string,
    selected: SelectedPreloadedResource,
    setSelected: React.Dispatch<
      React.SetStateAction<SelectedPreloadedResource>
    >,
    setOptions: React.Dispatch<React.SetStateAction<PreloadedResourcesOptions>>
  ) => void;
  handleChange: (
    resource: ResourceForBookingDTO,
    autocompleteId: string,
    reason: AutocompleteChangeReason,
    setSelected: React.Dispatch<
      React.SetStateAction<SelectedPreloadedResource>
    >,
    setOptions: React.Dispatch<React.SetStateAction<PreloadedResourcesOptions>>
  ) => void;
  handleSubmit?: (
    event: FormEvent<HTMLFormElement>,
    selectedPreloadedResource?: SelectedPreloadedResource
  ) => void | Promise<void>;
  buttonText?: string;
}

const PreloadedResourcesBlock = ({
  resourcesCategories,
  interventionData,
  selected,
  setSelected,
  title,
  buttonText,
  options,
  setOptions,
  categoriesQuantity,
  handleClick,
  handleChange,
  handleSubmit,
}: PreloadProposalResourcesProps) => {
  const { t } = useTranslation(["common"]);
  const autocompleteInputs: AutoCompleteInputs[] = [
    {
      id: "family",
      label: "family",
      options: options?.families || [],
    },
    {
      id: "resource",
      label: "resource",
      options: options?.resources || [],
    },
  ];

  const interventionDataInformation: InterventionDataInformation[] = [
    {
      id: "requestCode",
      label: "nhc",
    },
    {
      id: "procedureId",
      label: "intervention",
    },
    {
      id: "operatingRoom",
      label: "operating_room",
    },
    {
      id: "dateFrom",
      label: "date",
      format: (date: string | number | boolean) =>
        (date as string).length > 1
          ? formatStringToDateHour(date as string)
          : "-",
    },
  ];

  const selectedChipStyles = (id: string) => {
    if (selected?.categoryId === id) {
      return {
        backgroundColor: `${colorPalette.secondary.dark}`,
        color: `${colorPalette.main.white}`,
        fontWeight: "500",
      };
    }
    return {
      backgroundColor: `${colorPalette.primary.light}`,
      color: `${colorPalette.primary.mainInfo}`,
    };
  };

  return (
    <Box
      component={"div"}
      className={`${styles["preloaded-resources-block"]} ${
        buttonText && styles["preloaded-resources-block--column"]
      } u-padding-medium`}
    >
      <div
        className={`${styles["preloaded-resources-block__container"]} ${
          buttonText && styles["preloaded-resources-block__container--column"]
        }`}
      >
        <h2 className={`heading-secondary u-margin-bottom-small-medium`}>
          {t(`common:${title}`)}
        </h2>
        <div className={`${styles["preloaded-resources-block__categories"]}`}>
          {resourcesCategories.map(({ id, name }, indexNumber) => (
            <Chip
              key={`${id}_${indexNumber}`}
              label={
                <Box
                  className={`${styles["preloaded-resources-block__categories-chip"]}`}
                >
                  <p>{name}</p>
                  {!!categoriesQuantity?.[id] && (
                    <span>{categoriesQuantity?.[id]}</span>
                  )}
                </Box>
              }
              onClick={
                interventionData?.hub !== "-"
                  ? () => handleClick(id, selected, setSelected, setOptions)
                  : undefined
              }
              sx={{
                ...selectedChipStyles(id),

                "& .MuiChip-label": {
                  paddingRight: !!categoriesQuantity?.[id] ? "0.6rem" : "",

                  "& span": {
                    color: `${colorPalette.primary.mainInfo}`,
                  },
                },

                "&:hover": {
                  backgroundColor: `${colorPalette.secondary.light}`,
                },
              }}
            />
          ))}
        </div>
      </div>
      <form
        className={`${styles["preloaded-resources-block__container"]} ${
          styles["preloaded-resources-block__container--filters"]
        }  ${
          buttonText &&
          styles["preloaded-resources-block__container--column-filters"]
        }`}
        onSubmit={(event: FormEvent<HTMLFormElement>) =>
          handleSubmit && handleSubmit(event, selected)
        }
      >
        {interventionData && (
          <div
            className={`${styles["preloaded-resources-block__interventions-info"]}`}
          >
            {interventionDataInformation.map(({ id, label, format }) => {
              const value = interventionData?.[id] || "-";
              const content = format ? format(value) : value;
              return (
                <p key={id}>
                  <span className="heading-terciary">
                    {t(`common:${label}`)}:{" "}
                  </span>
                  {content}
                </p>
              );
            })}
          </div>
        )}
        <div className={`${styles["preloaded-resources-block__filters"]}`}>
          {autocompleteInputs.map(({ id, label, options }) => (
            <Autocomplete
              fullWidth
              key={label}
              disablePortal
              options={options}
              getOptionLabel={(option) =>
                (option as ResourceForBookingDTO).name
              }
              renderOption={(
                props: HTMLAttributes<HTMLLIElement>,
                option: ResourceForBookingDTO | string
              ) => (
                <ListItem {...props} sx={{ display: "flex", gap: "1rem" }}>
                  {(option as ResourceForBookingDTO).name}
                  <div className={styles["preloaded-resources-block__icons"]}>
                    {!(option as ResourceForBookingDTO).isAvailable && (
                      <ErrorIcon color="error" />
                    )}
                    {(option as ResourceForBookingDTO).isBooked && (
                      <ReportProblemIcon color="warning" />
                    )}
                  </div>
                </ListItem>
              )}
              noOptionsText={t("common:no_options")}
              value={selected?.[id]}
              onChange={(event, value, reason) =>
                handleChange(
                  value as ResourceForBookingDTO,
                  id,
                  reason,
                  setSelected,
                  setOptions
                )
              }
              renderInput={(params) => (
                <TextField {...params} label={t(`common:${label}`)} focused />
              )}
            />
          ))}
        </div>
        {buttonText && (
          <SubmitButton
            label={buttonText}
            icon={<AddIcon />}
            color={"secondary"}
            padding={"0.7rem 2.5rem"}
            isDisabled={
              !!!(selected?.categoryId.length && selected?.family) || false
            }
            width={"25.1rem"}
          />
        )}
      </form>
    </Box>
  );
};

export default PreloadedResourcesBlock;
