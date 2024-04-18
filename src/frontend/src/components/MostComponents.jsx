import React from "react";
// import { css } from "@emotion/core";
// import PropagateLoader from "react-spinners/PropagateLoader";
import { Controller } from "react-hook-form";
// import { useGlobalHook } from '@devhammed/use-global-hook'
import Select from "react-select";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { DTSubmit } from "./useStyles";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import WarningIcon from "@mui/icons-material/Warning";
export { WarningIcon } from "@mui/icons-material/Warning";

// import ClearIcon from '@mui/icons/Clear';
import { useTranslation } from "react-i18next";
// import WarningIconMU from '@mui/icons/Warning';

// Componenti JSX con richiamo semplificato.

export const MostTextField = ({
  name,
  label,
  defaultValue,
  autoComplete,
  autoFocus = false,
  fullWidth = true,
  margin = "dense",
  onChange,
  type = "text",
  variant = "outlined",
  //variant,
  required, // serve per fare aggiungere * al campo obbligatorio, oppure se si usano controlli del browser togliendo noValidate dalla form
  InputProps,
  value,
  disabled = false,
  register, // se si vuole avere required gestito da form react bisogna passare register={register({ required: true })}
}) => {
  return (
    <TextField
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      onChange={onChange}
      defaultValue={defaultValue}
      variant={variant}
      margin={margin}
      size="small"
      required={required}
      fullWidth={fullWidth}
      name={name}
      label={label}
      type={type}
      id={name}
      inputRef={register}
      InputProps={InputProps}
      value={value}
      disabled={disabled}
    />
  );
};

/*
// https://stackoverflow.com/questions/61655199/proper-way-to-use-react-hook-form-controller-with-material-ui-autocomplete
export const MostAutocomplete = ({
  options = [],
  renderInput,
  getOptionLabel,
  onChange: ignored,
  control,
  name,
  defaultValue,
  label,
  renderOption,
}) => {
  return (
    <Controller
      render={({ onChange, ...props }) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          onChange={(e, data) => onChange(data)}
          renderInput={(params) => (
            <TextField {...params} label={label} margin="dense" />
          )}
          {...props}
        />
      )}
      onChange={([, data]) => data}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
};
*/

export const MostCheckbox = ({ control, defaultChecked, label, name, onChange, register }) => {
  return (
    <FormControlLabel
      control={<Checkbox inputRef={register} control={control} name={name} color="primary" onChange={onChange} defaultChecked={defaultChecked} />}
      label={label}
    />
  );
};

export const MostSubmitButton = ({ label, onClick, type = "submit", disabled = false, className }) => {
  // const classes = useStyles();
  return (
    <Button onClick={onClick} disabled={disabled} type={type} fullWidth variant="contained" color="primary" className={`${DTSubmit} ${className}`}>
      {label}
    </Button>
  );
};

export const MostButton2 = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  variant = "outlined",
  color = "secondary",
  variab,
  variab_value,
  className,
}) => {
  if (variab !== undefined && variab === variab_value)
    return (
      <Button variant="contained" color="primary" onClick={onClick} type={type} className={className}>
        {label}
      </Button>
    );
  if (variab !== undefined && variab !== variab_value)
    return (
      <Button variant="outlined" color="secondary" onClick={onClick} type={type} className={className}>
        {label}
      </Button>
    );
  return (
    <Button onClick={onClick} disabled={disabled} type={type} variant={variant} color={color} className={className}>
      {label}
    </Button>
  );
};

export const selectValue2obj = (v, options) => {
  for (let i in options) if (options[i].value === v) return options[i];
  return "";
};

export const MostSelect = ({
  name,
  options,
  control,
  onChange, // xxx NON FUNZIONA
  required, // serve SOLO se si usano controlli del browser togliendo noValidate dalla form, NON serve per fare aggiungere * al campo obbligatorio (bisogna usare altri tipi di select) -> aggiungere " *" a mano...
  rules, // rules={{ required: true }} per rendere obbligatorio (react), comunque bisogna aggiungere " *" a mano
  className,
  placeholder,
  value,
  defaultValue = "", // funziona MA bisogna passare elemento delle opzioni e non solo il valore (vedi selectValue2obj()
  label,
}) => {
  if (!className) className = "";
  className += " MuiFormControl-marginDense blackColor";
  return (
    <Controller
      className={className}
      as={Select}
      name={name}
      value={value}
      options={options}
      control={control}
      required={required}
      rules={rules}
      onChange={onChange}
      defaultValue={defaultValue}
      placeholder={placeholder}
    />
  );
  /*
  // onChange non funziona usando "as" (che è deprecato)
  // ma con render funziona quasi nulla... (non funziona setValue)
  const extOnChange = onChange
  const extValue = value
  return (
    <Controller 
        className={className}
        render={(
            { onChange, onBlur, value, name, ref }
          ) => (
            <Select
                placeholder={placeholder}
                required={required} 
                options={options} 
                value={extValue} 
                onChange={(e) => {
                    onChange(e)
                    if(extOnChange) extOnChange(e)
                }} 
            />
        )}
        name={name} 
        value={value} 
        control={control} 
        rules={rules} 
        defaultValue="" 
        // onFocus
        />
  );
  */
};

export const Timeout = (props) => {
  const { userInfo } = useGlobalHook("userStore");
  if (props.idleTimeout && userInfo.username) {
    console.log("--- Idle timeout " + new Date());
    window.location.replace("/logout");
  }
  return null;
};

export const NoMatch = () => {
  console.log("--- NoMatch " + window.location.href);
  window.location.replace("/logout");
  return null;
};

export const Check = (props) => {
  if (props.good) return <CheckIcon className="goodValue vertMiddle" />;
  return <ClearIcon className="badValue vertMiddle" />;
};

export const XXXWarningIcon = () => <WarningIcon className="badValue vertMiddle" />;

export const Loading = () => {
  const spinnerCss = css`
    display: block;
    margin: 0 auto;
  `;
  return (
    <div>
      <PropagateLoader color="#AAAA00" css={spinnerCss} loading={true} />
    </div>
  );
};

export const MostAutocomplete = ({
  options = [],
  renderInput,
  getOptionLabel = (option) => (option && option.label ? option.label : ""),
  getOptionSelected = (option, value) => {
    if (!value || value.value === "") return true;
    if (value.value === option.value) return true;
  },
  onChange,
  onInputChange,
  onKeyDown,
  loading,
  disabled = false,
  control,
  name,
  id = null,
  defaultValue = null,
  label,
  value,
  renderOption,
  rules, // rules={{ required: true }} per rendere obbligatorio (form), comunque bisogna aggiungere " *" a mano
  errors,
  size,
  style,
  multiple,
  disableClearable,
  selectOnMobile,
}) => {
  const { t } = useTranslation();

  if (multiple && !defaultValue)
    // con multiple si aspetta un vettore
    defaultValue = [];
  if (!control)
    return (
      <Autocomplete
        name={name}
        id={id}
        options={options}
        disabled={disabled}
        getOptionLabel={getOptionLabel}
        getOptionSelected={getOptionSelected}
        renderOption={renderOption}
        style={style}
        multiple={multiple}
        size={size}
        defaultValue={defaultValue}
        disableClearable={disableClearable}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            margin="dense"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    );
  const customOnChange = onChange;
  // xxx nota: onChange ma non c'e' value !
  return (
    <React.Fragment>
      <Controller
        render={({ onChange, ...props }) => (
          <Autocomplete
            id={id}
            options={options}
            getOptionLabel={getOptionLabel}
            getOptionSelected={getOptionSelected}
            disabled={disabled}
            disableClearable={disableClearable}
            multiple={multiple}
            // aggiunto per gestione multiple. controllare che non abbia controindicazioni nel caso normale
            defaultValue={defaultValue}
            renderOption={renderOption}
            onChange={(e, data) => {
              // onChange senza control restituisce (e,el)
              if (customOnChange) customOnChange(null, data);
              return onChange(data);
            }}
            onInputChange={onInputChange}
            onKeyDown={onKeyDown}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                margin="dense"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            {...props}
          />
        )}
        // quale e' giusto?
        onChange={([, data]) => {
          if (onChange) onChange(data);
          return data;
        }}
        /*
      onChange={([, data]) => data }
      */
        defaultValue={defaultValue}
        name={name}
        control={control}
        rules={rules}
      />
      {errors && errors[name] && <div className="formFieldError">{t("campo obbligatorio")}</div>}
    </React.Fragment>
  );
};

export function CountrySelect({ onChange: ignored, options, name, label, control }) {
  return (
    <Controller
      render={({ onChange, ...props }) => (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
          onChange={(e, data) => onChange(data)}
          {...props}
        />
      )}
      onChange={([event, data]) => {
        return data;
      }}
      name={name}
      control={control}
    />
  );
}

export function MyAutocomplete({ onInputChange, onChange, options, value, label }) {
  return (
    <Autocomplete
      options={options}
      value={value}
      freeSolo
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
      getOptionLabel={(option) => option}
      onInputChange={onInputChange}
      onChange={onChange}
    />
  );
}

export function MyCheckbox({ checked, onChange, options, value, label }) {
  return <Checkbox checked={checked} onChange={onChange} />;
}

export const MyTextField = ({
  name,
  label,
  defaultValue,
  autoComplete,
  autoFocus = false,
  fullWidth = true,
  margin = "dense",
  onChange,
  type = "text",
  variant = "outlined",
  //variant,
  required, // serve per fare aggiungere * al campo obbligatorio, oppure se si usano controlli del browser togliendo noValidate dalla form
  InputProps,
  value,
  disabled = false,
  register, // se si vuole avere required gestito da form react bisogna passare register={register({ required: true })}
}) => {
  return <TextField onChange={onChange} name={name} label={label} type={type} id={name} value={value} disabled={disabled} />;
};
