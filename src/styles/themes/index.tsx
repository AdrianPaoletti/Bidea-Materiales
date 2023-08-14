import type {} from "@mui/lab/themeAugmentation";
import { createTheme, Theme } from "@mui/material/styles";

import { colorPalette } from "./color-palette";

export const defaultTheme: Theme = createTheme({
  palette: colorPalette,
  typography: {
    fontFamily: "Roboto",
    fontSize: 19.6,
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
          fontWeight: "700",
          textTransform: "none",
          padding: "2.5rem 3.5rem",
          marginRight: "4%",
          color: `${colorPalette.primary.mainDark}`,
        },
        textColorPrimary: {
          "&.Mui-selected": {
            color: `${colorPalette.secondary.main}`,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid",
          borderColor: `${colorPalette.primary.light}`,
        },
        indicator: {
          backgroundColor: `${colorPalette.secondary.main}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: `1px`,
          },
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        },
        input: {
          padding: "1.45rem 1.4rem 1.45rem 0",
        },
        notchedOutline: {
          borderColor: `${colorPalette.primary.main}`,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: `${colorPalette.primary.main}`,
          "&.Mui-focused": {
            color: `${colorPalette.primary.main}`,
          },
          "&.Mui-error": {
            color: "#F87171",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          letterSpacing: ".5px",
          padding: "1.2rem 2rem",
          boxShadow: "none",
          whiteSpace: "nowrap",
          minWidth: "auto",
          fontSize: "1.4rem",
        },
        startIcon: {
          "&>*:nth-of-type(1)": {
            fontSize: "2.4rem",
          },
        },
        contained: {
          color: `${colorPalette.main.white}`,
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "0.5rem",
          fontSize: "inherit",

          "& svg": {
            "&:hover": {
              color: `${colorPalette.primary.mainInfo}`,
            },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          position: "absolute",
          bottom: "-2.3rem",
          fontSize: "1.1rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          marginRight: "0.5rem",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "2rem",
        },
        sizeSmall: {
          padding: "1.2rem 2rem",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: `0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px ${colorPalette.primary.light}`,
          "&.Mui-expanded": {
            boxShadow: `0px 0px 0px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px ${colorPalette.primary.light}`,
            marginTop: 0,
          },
          "&:before": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: "2rem 3rem",
          borderBottom: `1px solid ${colorPalette.primary.light}`,
          "&.Mui-expanded": {
            minHeight: "4.8rem",
          },
        },
        content: {
          margin: 0,
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "2rem 3rem",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "2rem",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          borderTop: `1px solid ${colorPalette.primary.light}`,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
            padding: "5.87px 4px 5.15px 5px",
          },
        },
        endAdornment: {
          top: "auto",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        action: {
          paddingTop: "0.3rem",
        },
        icon: {
          display: "flex",
          alignItems: "center",
          fontSize: "3.2rem",
        },
        standardError: {
          border: `1px solid ${colorPalette.error.main}`,
        },
        standardSuccess: {
          border: `1px solid ${colorPalette.success.main}`,
        },
      },
    },
    MuiLoadingButton: {
      styleOverrides: {
        loadingIndicator: {
          left: "1.9rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { padding: "1rem" },
        popper: { offset: [0, -15] },
      },
    },
  },
});
