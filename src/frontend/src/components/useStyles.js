import { styled } from '@mui/system';
import { theme } from './theme';

export const DTGrow = styled('grow')({
    flexGrow: 1,
});
export const DTMenuButton = styled('menuButton')({
    marginRight: 1,
});
export const DTFooter = styled('menuButton')({
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '44px',
    padding: '12px 20px',
    padding: theme.spacing(3, 2),
    whiteSpace: 'nowrap',
    marginTop: 'auto',
    //background-color: '#f5f5f5'
});
export const DTForm = styled('form')({
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
});
export const DTHeaderTitle = styled('headerTitle')({
    display: 'block',
});
export const DTPaper = styled('paper')({
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});
export const DTRoot = styled('root')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});
export const DTSectionUser = styled('sectionUser')({
    display: 'flex',
});
export const DTSubmit = styled('submit')({
    margin: theme.spacing(3, 0, 2),
});
export const DTTable = styled('table')({
      border: '1px',
});
