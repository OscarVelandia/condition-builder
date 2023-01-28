import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ComparisonOperator } from '@utils';

export const FormRowTexts = {
  leftCondition: 'Left Condition',
  operator: 'Operator',
  or: 'OR',
  value: 'Value',
};

export enum InputConfigName {
  LeftConditionConfig = 'leftConditionConfig',
  OperatorConfig = 'operatorConfig',
  ValueInputConfig = 'valueInputConfig',
}
type InputValue = string | ComparisonOperator;
type InputConfig<TValue = string> = {
  value: TValue;
  onChange: (inputName: InputConfigName, value: InputValue) => void;
};

type SelectInput<T> = {
  options: T;
};

export type LeftInputConditionConfig = InputConfig & SelectInput<Array<string>>;
export type OperatorInputConfig = InputConfig<ComparisonOperator> &
  SelectInput<Array<ComparisonOperator>>;
export type ValueInputConfig = InputConfig;

export type AddConditionConfig = {
  onBlur: () => void;
  onClick: () => void;
  onHover: () => void;
};

interface Props {
  addConditionConfig: AddConditionConfig;
  hasOrPrefix: boolean;
  hasValueInputError: boolean;
  isDisabledRemoveConditionButton: boolean;
  leftConditionConfig: LeftInputConditionConfig;
  onRemoveConditionButtonClick: () => void;
  operatorConfig: OperatorInputConfig;
  valueInputConfig: ValueInputConfig;
}

export function FormRow({
  addConditionConfig,
  hasOrPrefix,
  hasValueInputError,
  isDisabledRemoveConditionButton,
  leftConditionConfig,
  onRemoveConditionButtonClick,
  operatorConfig,
  valueInputConfig,
}: Props) {
  return (
    <Box
      display="flex"
      gap="1rem"
      sx={{ alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}
    >
      {hasOrPrefix ? (
        <Typography
          alignSelf="center"
          color="primary"
          component="p"
          fontWeight={700}
          marginX="1rem"
          variant="h6"
        >
          {FormRowTexts.or}
        </Typography>
      ) : null}
      <FormControl fullWidth>
        <InputLabel id={`${FormRowTexts.leftCondition}-select-label`}>
          {FormRowTexts.leftCondition}
        </InputLabel>
        <Select
          id={`${FormRowTexts.leftCondition}-select-label`}
          label={FormRowTexts.leftCondition}
          labelId={`${FormRowTexts.leftCondition}-select-label`}
          onChange={(event) => {
            leftConditionConfig.onChange(InputConfigName.LeftConditionConfig, event.target.value);
          }}
          value={leftConditionConfig.value}
        >
          {leftConditionConfig.options.map((option) => {
            return (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id={`${FormRowTexts.operator}-select-label`}>
          {FormRowTexts.operator}
        </InputLabel>
        <Select
          id={`${FormRowTexts.operator}-select-label`}
          label={FormRowTexts.operator}
          labelId={`${FormRowTexts.operator}-select-label`}
          onChange={(event) => {
            operatorConfig.onChange(InputConfigName.OperatorConfig, event.target.value);
          }}
          value={operatorConfig.value}
        >
          {operatorConfig.options.map((operator) => {
            return (
              <MenuItem key={operator} value={operator}>
                {operator}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        id={`${FormRowTexts.value}-select-label`}
        label={FormRowTexts.value}
        onChange={(event) => {
          operatorConfig.onChange(InputConfigName.ValueInputConfig, event.target.value);
        }}
        value={valueInputConfig.value}
        error={hasValueInputError}
      />
      <Box display="flex">
        <IconButton
          color="primary"
          onClick={addConditionConfig.onClick}
          onMouseEnter={addConditionConfig.onHover}
          onMouseLeave={addConditionConfig.onBlur}
          size="large"
        >
          <AddIcon />
        </IconButton>
        <IconButton
          disabled={isDisabledRemoveConditionButton}
          color="warning"
          onClick={onRemoveConditionButtonClick}
          size="large"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
