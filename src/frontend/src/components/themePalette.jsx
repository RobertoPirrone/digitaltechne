import { blue, green, lime, purple, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const app = import.meta.env.VITE_APPLICATION;
let palette = {};

switch (app) {
    case 'digitaltechne':
        palette = {
            primary: red,
            background: { default: "#f8f8f8" }
        };
        break;

    case 'gramberg':
        palette = {
            primary: lime,
            background: { default: "#f0f0e2" }
        };
        break;

    case 'valsecchi':
        palette = {
            primary: blue,
            background: { default: "#f0f0f0" }
        };
        break;

    default:
        alert("unknown app: ", app);
}

console.log("Palette:");
console.dir(palette);

export const theme = createTheme({
    palette: palette
});
