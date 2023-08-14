import {
  PurchaseReportItemDateI18n,
  PurchaseReportRow,
} from "@ikusi/resources-management-api-typescript-fetch";
import { Parser } from "@json2csv/plainjs";

const generateShoopingReport = (
  purchaseReportRow: PurchaseReportRow[],
  language: keyof PurchaseReportItemDateI18n,
  name: string
) => {
  const data = purchaseReportRow.map((row) => {
    let newRow = {};
    for (const key of Object.keys(row) as Array<keyof PurchaseReportRow>) {
      newRow = { ...newRow, [row[key].i18n[language]]: row[key].value };
    }
    return newRow;
  });
  const parser = new Parser({});
  const csvData = parser.parse(data);
  const link = document.createElement("a");

  link.setAttribute("href", `data:text/csv;charset=utf-8,${csvData}`);
  link.setAttribute("download", name);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default generateShoopingReport;
