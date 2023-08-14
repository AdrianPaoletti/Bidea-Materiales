import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { InterventionDTO } from "@ikusi/resources-management-api-typescript-fetch";
import SearchIcon from "@mui/icons-material/Search";

import { interventionsManagementApi } from "resources-management/core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import ResourcesManagementContext from "resources-management/core/store/context/ResourcesManagementContext";
import { CLoadingButton } from "../UI/Buttons";
import TextSearchField from "../UI/TextInputs";

import styles from "./SearchBar.module.scss";

export interface SearchBarProps {
  setInterventionData: React.Dispatch<React.SetStateAction<InterventionDTO>>;
}

const SearchBar = ({ setInterventionData }: SearchBarProps) => {
  const router = useRouter();

  const { clientSession } = useContext(ResourcesManagementContext);
  const [interventionCode, setInterventionCode] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const setInitialIntervention = useCallback(async () => {
    const interventionRequestcode = parseInt(
      (router.query.interventionRequestCode as string) || ""
    );
    const interventionHub = (router.query.interventionHub as string) || "";
    if (!interventionRequestcode || !interventionHub) {
      return;
    }
    const intervention = await interventionsManagementApi.getIntervention({
      interventionHub: interventionHub,
      interventionRequestCode: interventionRequestcode,
    });
    setInterventionData(intervention);
  }, [
    router.query.interventionHub,
    router.query.interventionRequestCode,
    setInterventionData,
  ]);

  useEffect(() => {
    setInitialIntervention().catch((e) => console.log(e));
  }, [setInitialIntervention]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIsDisabled(value.length ? false : true);
    setIsError(false);
    setInterventionCode(+value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const intervention = await interventionsManagementApi.getIntervention({
        interventionHub: clientSession.centroActual,
        interventionRequestCode: interventionCode,
      });
      setInterventionData(intervention);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  return (
    <form
      className={`${styles["search-bar"]}`}
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextSearchField
        label={`intervention_search`}
        changeHandler={handleChange}
        error={isError}
        helperText={isError ? "err_intervention_not_found" : ""}
      />
      <div className="u-margin-left-small">
        <CLoadingButton
          isDisabled={isDisabled}
          isLoading={isLoading}
          label={"search"}
          icon={<SearchIcon fontSize="inherit" color="inherit" />}
        />
      </div>
    </form>
  );
};

export default SearchBar;
