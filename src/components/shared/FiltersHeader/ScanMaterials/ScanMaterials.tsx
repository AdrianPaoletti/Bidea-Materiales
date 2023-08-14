import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import "dayjs/locale/es";
import {
  BarcodeReadingDTO,
  NewBarcodeDTO,
} from "@ikusi/resources-management-api-typescript-fetch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";

import { barCodeReadingApi } from "resources-management/core/services/resources-management-api-typescript-fetch/resources-management-api.service";
import { barcodeDeviceKeyDownEventHandler } from "resources-management/utils/barcode-parsing/barcode-device-input-parser.utils";
import { formatDateHourToBackend } from "resources-management/utils/date-utils/format-date.utils";
import { SubmitButton, TextButton } from "../../UI/Buttons";
import DateCalendarPicker from "../../UI/DateCalendarPicker";
import OutlinedInputs from "../../UI/OutlinedInputs";
import { ChangeEventDatePicker } from "./scan-materials.model";

import styles from "./ScanMaterials.module.scss";

export interface ScanMaterialProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBarcodeReaded: (barcodeReadingDTO: BarcodeReadingDTO) => unknown;
}

const ScanMaterial = ({ setIsOpen, onBarcodeReaded }: ScanMaterialProps) => {
  const materialInitialValue: NewBarcodeDTO = {
    barcode: "",
  };
  const { t } = useTranslation(["common", "cta"]);
  const [scannedMaterial, setScannedMaterial] =
    useState<NewBarcodeDTO>(materialInitialValue);
  const [selectedDate, setSelectedDate] =
    useState<null | ChangeEventDatePicker>(null);
  const [barcodeDeviceValue, setBarcodeDeviceValue] = useState<string>("");
  const [isAccordionExpanded, setIsAccordionExpanded] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const barcodeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeInput.current?.click();
  }, []);

  const scannedMaterialInputs: {
    label: string;
    id: keyof NewBarcodeDTO;
    keyDown?: (event: React.KeyboardEvent) => void;
  }[] = [
    {
      label: "barcode",
      id: "barcode",
      keyDown: (event: React.KeyboardEvent) => handleKeyDown(event, "barcode"),
    },
    { label: "date_of_expiry", id: "expiryDate" },
    { label: "batch", id: "batchNumber" },
    { label: "price", id: "price" },
    { label: "serial_number", id: "serialNumber" },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setScannedMaterial({
      ...scannedMaterial,
      [id]: value,
    });
    if ((value.length && id === "barcode") || scannedMaterial.barcode.length) {
      setIsDisabled(false);
      setBarcodeDeviceValue(value);
      return;
    }
    setIsDisabled(true);
  };

  const handleDatePickerChange = (
    event: ChangeEventDatePicker | null,
    id: keyof NewBarcodeDTO | string
  ) => {
    setSelectedDate(event);
    setScannedMaterial({
      ...scannedMaterial,
      [id]: formatDateHourToBackend((event as ChangeEventDatePicker).$d),
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    const value = barcodeDeviceKeyDownEventHandler(event, barcodeDeviceValue);
    setBarcodeDeviceValue(value);
    setScannedMaterial({ ...scannedMaterial, [id]: value });
    value.length ? setIsDisabled(false) : setIsDisabled(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let newBarcodeDTO!: NewBarcodeDTO;
      for (const [key, value] of Object.entries(scannedMaterial)) {
        const isPriceKey = key === "price";
        if (!!scannedMaterial[key as keyof NewBarcodeDTO]) {
          newBarcodeDTO = {
            ...newBarcodeDTO,
            [key]: isPriceKey ? +value : value,
          };
        }
      }
      const scannedMaterialResponse =
        await barCodeReadingApi.addOrUpdateBarCodeReading({
          newBarcodeDTO,
        });
      onBarcodeReaded(scannedMaterialResponse);
    } catch (error) {
      throw new Error("Error adding or updating the code reading: " + error);
    }
    setIsOpen(false);
    setIsAccordionExpanded(false);
  };

  return (
    <article className={`${styles["scan-material"]}`}>
      <Accordion elevation={1} expanded={isAccordionExpanded}>
        <AccordionSummary
          onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
          expandIcon={<ExpandMoreIcon />}
        >
          <Box className={styles["accordion__title"]}>
            <h3 className="heading-secondary-accordion">
              {t("common:scan_material")}
            </h3>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className={styles["accordion__form"]}>
              {scannedMaterialInputs.map(({ label, id, keyDown }) =>
                id === "expiryDate" ? (
                  <DateCalendarPicker
                    id={id}
                    label={label}
                    value={selectedDate}
                    handleDelete={(id) => {
                      setSelectedDate(null);
                      setScannedMaterial({
                        ...scannedMaterial,
                        [id]: null,
                      });
                    }}
                    handleChange={handleDatePickerChange}
                    isPastDisabled={true}
                    key={id}
                  />
                ) : (
                  <OutlinedInputs
                    key={id}
                    id={id}
                    label={label}
                    keyDown={keyDown}
                    handleChange={handleChange}
                    refElement={barcodeInput}
                    value={scannedMaterial}
                  />
                )
              )}
            </div>
            <div
              className={`${styles["accordion__buttons"]} u-margin-top-small`}
            >
              <TextButton
                label="cancel"
                onClickHandler={() => {
                  setIsAccordionExpanded(false);
                  setScannedMaterial(materialInitialValue);
                }}
              />
              <SubmitButton label="finish" isDisabled={isDisabled} />
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
    </article>
  );
};

export default ScanMaterial;
