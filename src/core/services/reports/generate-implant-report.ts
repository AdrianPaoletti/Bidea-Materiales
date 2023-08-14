import {
  generateImplantReport,
  ImplantReportDTO,
  REPORT_SUPPORTED_LANGS,
} from "@ikusi/surgery-reporting";

import { formatToStringDDMMYYY } from "../../../utils/date-utils/format-date.utils";
import { forwardMesaDeProgramacionApi } from "../forward-api-typescript-fetch/forward-api.service";
import {
  coreAPi,
  followedMaterialsApi,
  interventionsManagementApi,
} from "../resources-management-api-typescript-fetch/resources-management-api.service";

export const implantReport = async ({
  interventionRequestCode,
  interventionHub,
  fileName,
  lang,
  withPatient
}: {
  interventionRequestCode: number;
  interventionHub: string;
  fileName: string;
  lang: REPORT_SUPPORTED_LANGS;
  withPatient: boolean
}) => {
  const intervention = await interventionsManagementApi.getIntervention({
    interventionHub,
    interventionRequestCode,
  });
  const implants = await followedMaterialsApi.queryBookingTrackings({
    queryBookingTrackingsRequest: {
      filters: {
        hubInternalCode: interventionHub,
        interventionRequestCode: interventionRequestCode,
      },
    },
  });

  const additionalInfo = (
    await forwardMesaDeProgramacionApi.queryElementoProgramado({
      centro: intervention.hub,
      codSolicitud: intervention.requestCode.toString(),
      fecha: formatToStringDDMMYYY(new Date(intervention.dateFrom)),
    })
  ).pop();

  const implantDTO: ImplantReportDTO = {
    id: "",
    patient: {
      nhc: additionalInfo?.cic || "", //ask to forward
      name: withPatient ? additionalInfo?.paciente || "" : "",
    },
    implants: implants.map((implant) => ({
      hospital: {
        reference: interventionHub,
      },
      manufacturerProductCode: implant.barcodeReading?.manufacturerProductReference || "",
      manufacturer: {
        name: implant.barcodeReading?.manufacturerName || "",
        reference: implant.barcodeReading?.manufacturerCode || "",
      },
      provider: {
        name: implant.barcodeReading?.providerName || "",
        reference: implant.barcodeReading?.providerCode || "",
      },
      ean: implant.barcodeReading?.refference || "",
      description: implant.barcodeReading?.description || "",
      serialNumber: implant.barcodeReading?.serialNumber || "",
      lotNumber: implant.barcodeReading?.batchNumber || "",
      expirationDate: implant.barcodeReading?.expiryDate
        ? new Date(implant.barcodeReading?.expiryDate).toLocaleDateString()
        : "",
      unit: "",
      quantity: 1,
      price: implant.barcodeReading?.price || 0,
    })),
    surgeryDate: new Date(intervention.dateFrom).toLocaleDateString(),
    implantationDate: new Date(intervention.dateFrom).toLocaleDateString(),
    surgery: {
      reference: intervention.requestCode.toString(),
      name: "",
      procedure: {
        reference: intervention.procedureId,
        name: "", //name: additionalInfo?.prestacion || "",
      },
      speciality: {
        name: additionalInfo?.servicio.descripcion || "", //ask to forward
      },
      operatingRoom: {
        name: intervention.operatingRoom,
      },
    },
    surgeon: {
      reference: intervention.facultativeId,
      name: "", //additionalInfo?.nombreCirujano
    },
    hospital: {
      reference: intervention.hub,
      name: "Hospital Clínico San Carlos",
    },
    reportDate: "", //new Date().toLocaleDateString()
    registryDate: "", //new Date().toLocaleDateString()
  };

  // Convert the image data to a base64-encoded string
  const file = await coreAPi.getLogo();
  const binarydoc = await generateImplantReport({
    dto: implantDTO,
    logo: {
      base64: file.base,
      format: "jpeg",
      width: file.width,
      height: file.height,
    },
    lang,
  });

  try {
    const url = window.URL.createObjectURL(new Blob([binarydoc]));
    const link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.pdf`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (e) {
    console.error("BlobToSaveAs error", e);
  }
};
