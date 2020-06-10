import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Switch,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { isEmpty } from 'lodash';

const StatefulTextField = ({ field, clear }) => {
  const {
    label,
    property,
    onChange,
    disabled,
    onValidate,
    validationErrorMsg,
    focus,
    type,
    active,
  } = field;
  const [value, setValue] = useState(field.value || '');
  const [isValid, setIsValid] = useState(true);

  const firstUpdate = useRef(true); // dont run on mount

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleValidation();
  }, [value]);
  useEffect(() => {
    if (clear === 0) {
      return;
    }
    firstUpdate.current = true;
    setValue(field.value || '');
  }, [clear]);
  const handleChange = event => {
    const newValue = event.target.value;

    console.log(newValue);
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleValidation = () => {
    if (onValidate) {
      const result = onValidate(value);
      setIsValid(result);
    }
  };

  const props = {};
  if (!isValid) {
    props['error'] = true;
    props['helperText'] = !isEmpty(validationErrorMsg)
      ? validationErrorMsg
      : 'Incorrect Input';
  } else {
    props['error'] = undefined;
    props['helperText'] = undefined;
  }

  if (focus) {
    props['autoFocus'] = true;
  }

  return (
    <Box hidden={!active}>
      <InputLabel shrink>{label}</InputLabel>
      <TextField
        id={`${property}-outlined`}
        type={type}
        onChange={handleChange}
        onBlur={handleValidation}
        disabled={!!disabled}
        fullWidth={true}
        autoComplete="false"
        size="small"
        variant="outlined"
        {...props}
      />
    </Box>
  );
};

export const renderTextField = (field, clear) => {
  if (typeof field.active == 'undefined') {
    field.active = true;
  }
  return <StatefulTextField field={field} clear={clear} />;
};

const StatefulMultilineTextField = ({ field, clear }) => {
  const {
    label,
    property,
    onChange,
    disabled,
    onValidate,
    validationErrorMsg,
    focus,
  } = field;
  const [value, setValue] = useState(field.value || '');
  const [isValid, setIsValid] = useState(true);

  const firstUpdate = useRef(true); // dont run on mount

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleValidation();
  }, [value]);
  useEffect(() => {
    if (clear === 0) {
      return;
    }
    firstUpdate.current = true;
    setValue(field.value || '');
  }, [clear]);
  const handleChange = event => {
    const newValue = event.target.value;
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleValidation = () => {
    if (onValidate) {
      const result = onValidate(value);
      setIsValid(result);
    }
  };

  const props = {};
  if (!isValid) {
    props['error'] = true;
    props['helperText'] = !isEmpty(validationErrorMsg)
      ? validationErrorMsg
      : 'Incorrect Input';
  } else {
    props['error'] = undefined;
    props['helperText'] = undefined;
  }

  if (focus) {
    props['autoFocus'] = true;
  }

  return (
    <Box>
      <InputLabel shrink>{label}</InputLabel>
      <TextField
        id={`${property}-outlined`}
        value={value}
        multiline
        rows={4}
        onChange={handleChange}
        fullWidth={true}
        autoComplete="false"
        size="small"
        variant="outlined"
        {...props}
      />
    </Box>
  );
};

export const renderMultilineTextField = (field, clear) => {
  return <StatefulMultilineTextField field={field} clear={clear} />;
};

const StatefulSwitch = ({ field }) => {
  const { label, onChange } = field;
  const [value, setValue] = useState(field.value || false);

  const handleChange = () => {
    const newValue = !value;
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const switchLabel = value ? field.onLabel : field.offLabel;

  return (
    <Box display="flex" alignItems="center">
      <Box
        style={{
          borderRadius: '50px',
          border: '1px solid #ccc',
          margin: '5px 10px 5px 0',
        }}
      >
        <Switch
          checked={value}
          onChange={handleChange}
          name="checkedA"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <Typography variant="caption" style={{ opacity: 0.5, marginRight: 10 }}>
          {switchLabel}
        </Typography>
      </Box>
      <Typography>{label}</Typography>
    </Box>
  );
};

export const renderSwitch = field => {
  return <StatefulSwitch field={field} />;
};

const StatefulSelectField = ({ field }) => {
  const { label, property, onChange, disabled, choices } = field;

  const [value, setValue] = useState(field.defaultvalue || '');

  const handleChange = event => {
    const newValue = event.target.value;
    setValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box>
      <InputLabel shrink>{label}</InputLabel>
      <FormControl
        style={{
          width: '100%',
        }}
        variant="outlined"
        size="small"
      >
        <Select
          labelId={`label-${property}`}
          id={`select-${property}`}
          value={value}
          defaultValue={value}
          disabled={!!disabled}
          onChange={handleChange}
          className="btn btn-primary"
        >
          {choices.map((c, index) => (
            <MenuItem key={index} value={c.value} className="dropdown-item">
              {c.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const StatefulToggleButtonFieldOld = ({ field }) => {
  const { label, property, onChange, disabled, choices } = field;

  const [value, setValue] = useState(field.defaultvalue || '');

  console.log({ choices, value });

  const handleChange = event => {
    const newValue = event.target.value;
    console.log(newValue);
    // setValue(newValue);

    // if (onChange) {
    //   onChange(newValue);
    // }
  };

  return (
    <Box>
      <InputLabel shrink>{label}</InputLabel>
      <FormControl
        style={{
          width: '100%',
        }}
        variant="outlined"
        size="small"
      >
        <ToggleButtonGroup
          labelId={`label-${property}`}
          id={`select-${property}`}
          value={value}
          exclusive
          onChange={handleChange}
          size="medium"
        >
          {choices.map((c, index) => {
            console.log({ c, index });
            return (
              <ToggleButton key={index} value={c.value}>
                {`$${c.label}`}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>

        {/* <Select
          labelId={`label-${property}`}
          id={`select-${property}`}
          value={value}
          defaultValue={value}
          disabled={!!disabled}
          onChange={handleChange}
          className="btn btn-primary"
        >
          {choices.map((c, index) => (
            <MenuItem key={index} value={c.value} className="dropdown-item">
              {c.label}
            </MenuItem>
          ))}
        </Select> */}
      </FormControl>
    </Box>
  );
};

const StatefulToggleButtonField = ({ field }) => {
  const { label, property, onChange, disabled, choices } = field;

  const [value, setValue] = useState(field.defaultvalue || '');
  const [customValue, setCustomValue] = useState();

  const formatCurrency = (number, currency = 'USD') =>
    number.toLocaleString('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const handleClick = amt => {
    const newValue = amt;

    // Set the custom value to empty.
    setCustomValue('');
    setValue(newValue);
    onChange(newValue);
  };

  const handleChange = event => {
    const newValue = event.target.value.replace(/[^0-9]/g, '');

    if (newValue.length < 5) {
      setCustomValue(newValue);
      setValue(newValue);
      onChange(newValue);
    } else if (newValue.length === 5) {
      const number = newValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      setCustomValue(number);
      setValue(number);
      onChange(number);
    }
  };

  const buttons = choices.map(choice => {
    const amt = choice.value;
    const variant = value === amt ? 'contained' : 'outlined';

    return (
      <Grid item xs={4} sm={4} md={3}>
        <Button
          id={amt}
          value={amt}
          fullWidth
          disableRipple
          variant={variant}
          color="primary"
          size="large"
          onClick={() => handleClick(amt)}
        >
          {formatCurrency(amt)}
        </Button>
      </Grid>
    );
  });

  const customAmount = (
    <Grid item xs={4} sm={4} md={3}>
      <TextField
        value={customValue}
        fullWidth
        size="small"
        label="Custom"
        variant="outlined"
        onClick={() => handleClick('customAmount')}
        onChange={handleChange}
      />
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {buttons}
      {customAmount}
    </Grid>
  );
};

export const renderSelectField = field => {
  return <StatefulSelectField field={field} />;
};

export const renderToggleButtonField = field => {
  return <StatefulToggleButtonField field={field} />;
};

export const renderFormField = (field, clear, md) => {
  switch (field.type) {
    case 'text':
      return renderTextField(field, clear);
    case 'multiline':
      return renderMultilineTextField(field, clear);
    case 'switch':
      return renderSwitch(field, clear);
    case 'select':
      return renderSelectField(field, clear);
    case 'toggleButton':
      return renderToggleButtonField(field, clear);
    default:
      return null;
  }
};
