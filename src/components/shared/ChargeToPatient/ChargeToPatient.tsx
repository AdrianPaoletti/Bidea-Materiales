import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { FullBookingTrackingDTO } from "@ikusi/resources-management-api-typescript-fetch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box } from "@mui/material";

import { updateTrackingRequestState } from "../../../core/services/tracking-requests/tracking-requests.service";
import { snackbarActions } from "../../../core/store/redux/snackbar/snackbar.actions";
import { formatChargeToPatientTableData } from "../../../utils/charge-to-patient/charge-to-patient-table.utils";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { ContainedButton } from "../UI/Buttons";
import { ChargeToPatientTableRow } from "./ChargeToPatientTable/charge-to-patient-table.model";
import ChargeToPatientTable from "./ChargeToPatientTable/ChargeToPatientTable";

import styles from "./ChargeToPatient.module.scss";

export interface ChargeToPatientProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resourcesData: FullBookingTrackingDTO[];
  onChargedToPatient: () => Promise<void>;
}

const ChargeToPatient = ({
  isOpen,
  setIsOpen,
  resourcesData,
  onChargedToPatient,
}: ChargeToPatientProps) => {
  const dispatch = useDispatch();
  const [rowsToUpdate, setRowsToUpdate] = useState<FullBookingTrackingDTO[]>(
    []
  );
  const [tableRows, setTableRows] = useState<ChargeToPatientTableRow[]>([]);
  const [isRowIdOpen, setIsRowIdOpen] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (isOpen) {
      const alreadyChargedToPatient =
        resourcesData?.filter(
          (row) =>
            row.state.id !== "CHARGED_TO_PATIENT" && row.state.id !== "PLANNED"
        ) || [];
      setRowsToUpdate(alreadyChargedToPatient);
      setTableRows(formatChargeToPatientTableData(alreadyChargedToPatient));
    }
    setIsRowIdOpen({});
  }, [resourcesData, isOpen]);

  const handleDelete = (rowId: string) => {
    const toUpdate = rowsToUpdate.filter((row) => row.id !== rowId);
    const keyToChange = toUpdate.find(
      ({ id }) => !Object.keys(isRowIdOpen).includes(id)
    );
    if (Object.keys(isRowIdOpen).length === toUpdate.length && keyToChange) {
      setIsRowIdOpen((prevIsRowIdOpen) => {
        const prevIsRowIdOpenValue = prevIsRowIdOpen[rowId];
        delete prevIsRowIdOpen[rowId];
        return { ...prevIsRowIdOpen, [keyToChange?.id]: prevIsRowIdOpenValue };
      });
    }
    setRowsToUpdate(toUpdate);
    setTableRows(formatChargeToPatientTableData(toUpdate));
  };

  const chargeToPatient = async () => {
    for (const trackingRequest of rowsToUpdate) {
      try {
        await updateTrackingRequestState(trackingRequest, "CHARGED_TO_PATIENT");
      } catch (error) {
        dispatch(
          snackbarActions.setSnackbarMessage(
            "errors:err_ocurred_while_assigning_patient",
            trackingRequest.resource?.name || "",
            "warning",
            4000
          )
        );
      }
    }
    await onChargedToPatient();
    setIsOpen(false);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      headerTitle={"impute_to_patient"}
      icon={<PersonAddIcon fontSize="inherit" color="inherit" />}
    >
      <Box component={"div"} className="u-padding-modal">
        <ChargeToPatientTable
          handleDelete={handleDelete}
          tableRows={tableRows}
          isRowIdOpen={isRowIdOpen}
          setIsRowIdOpen={setIsRowIdOpen}
        />
        <div className={`${styles["charge-to-patient__button"]}`}>
          <ContainedButton
            label="impute_to_patient"
            icon={<PersonAddIcon fontSize="large" color="inherit" />}
            onClickHandler={() => chargeToPatient()}
          />
        </div>
      </Box>
    </ModalWrapper>
  );
};

export default ChargeToPatient;
