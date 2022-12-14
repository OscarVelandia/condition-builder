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

const texts = {
  leftCondition: 'Left Condition',
  operator: 'Operator',
  or: 'OR',
  value: 'Value',
};

export enum ComparisonOperator {
  Contain = 'Contain',
  Equals = 'Equals',
  GreaterThan = 'Greater Than',
  LessThan = 'Less Than',
  NotContain = 'NotContain',
  Regex = 'Regex',
}

// const comparisonOperations = {
//   [ComparisonOperator.Contain]: (a: string, b: string) => a.includes(b),
//   [ComparisonOperator.Equals]: (a: unknown, b: unknown) => a === b,
//   [ComparisonOperator.GreaterThan]: (a: number, b: number) => a > b,
//   [ComparisonOperator.LessThan]: (a: number, b: number) => a < b,
//   [ComparisonOperator.NotContain]: (a: string, b: string) => !a.includes(b),
//   [ComparisonOperator.Regex]: (a: string, regex: string) => new RegExp(`${regex}`).test(a),
// };

export enum InputConfigName {
  LeftConditionConfig = 'leftConditionConfig',
  OperatorConfig = 'operatorConfig',
  ValueInputConfig = 'valueInputConfig',
}
type InputValue = string | ComparisonOperator;
type InputConfig = {
  value: string | ComparisonOperator;
  onChange: (inputName: InputConfigName, value: InputValue) => void;
};

type SelectInput<T> = {
  options: T;
};

export type LeftInputConditionConfig = InputConfig & SelectInput<Array<string>>;
export type OperatorInputConfig = InputConfig & SelectInput<Array<ComparisonOperator>>;
export type ValueInputConfig = InputConfig;

export type AddConditionConfig = {
  onBlur: () => void;
  onClick: () => void;
  onHover: () => void;
};

interface Props {
  addConditionConfig: AddConditionConfig;
  hasOrPrefix: boolean;
  leftConditionConfig: LeftInputConditionConfig;
  operatorConfig: OperatorInputConfig;
  valueInputConfig: ValueInputConfig;
}

export function FormRow({
  addConditionConfig,
  hasOrPrefix,
  leftConditionConfig,
  operatorConfig,
  valueInputConfig,
}: Props) {
  return (
    <Box display="flex" gap="1rem" sx={{ height: '3.5rem', width: '100%' }}>
      {hasOrPrefix ? (
        <Typography
          alignSelf="center"
          color="primary"
          component="p"
          fontWeight={700}
          marginX="1rem"
          variant="h6"
        >
          {texts.or}
        </Typography>
      ) : null}
      <FormControl fullWidth>
        <InputLabel id={`${texts.leftCondition}-select-label`}>{texts.leftCondition}</InputLabel>
        <Select
          id={`${texts.leftCondition}-select-label`}
          label={texts.leftCondition}
          labelId={`${texts.leftCondition}-select-label`}
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
        <InputLabel id={`${texts.operator}-select-label`}>{texts.operator}</InputLabel>
        <Select
          id={`${texts.operator}-select-label`}
          label={texts.operator}
          labelId={`${texts.operator}-select-label`}
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
        id={`${texts.value}-select-label`}
        label={texts.value}
        onChange={(event) => {
          operatorConfig.onChange(InputConfigName.ValueInputConfig, event.target.value);
        }}
        value={valueInputConfig.value}
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
        <IconButton color="warning" size="large">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
