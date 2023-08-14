export interface TableMenuItem {
  label: string;
  action: (tableRowid: string) => void;
  icon: () => JSX.Element;
}
