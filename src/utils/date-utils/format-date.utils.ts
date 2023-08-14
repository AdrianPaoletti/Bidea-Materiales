export const formatStringToDateHour = (stringDate: string) => {
  const date = new Date(stringDate);
  return date.toLocaleString("es", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatToStringDDMMYYY = (date: Date) => {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();


  let day = `${dd}`;
  let month = `${mm}`;

  if (dd < 10) {
    day = '0' + dd
  };
  if (mm < 10) {
    month = '0' + mm
  };
  return `${day}-${month}-${yyyy}`;

}

export const formatStringToDate = (stringDate: string) => {
  const date = new Date(stringDate);
  return date.toLocaleDateString("es");
};

export const formatDateHourToBackend = (date: Date): string => {
  return date.toISOString();
};
