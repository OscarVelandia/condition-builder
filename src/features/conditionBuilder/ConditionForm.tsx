import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';

const texts = {
  leftCondition: 'Left Condition',
  operator: 'Operator',
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

type FormInputOnChange = { onChange: (value: string) => void };

type InputConfig<T> = {
  options: T;
  value: string | ComparisonOperator;
} & FormInputOnChange;

export type LeftInputConditionConfig = InputConfig<Array<string>>;
export type OperatorInputConfig = InputConfig<Array<ComparisonOperator>>;
export type ValueInputConfig = FormInputOnChange & { value: string };

interface Props {
  leftConditionConfig: LeftInputConditionConfig;
  operatorConfig: OperatorInputConfig;
  valueInputConfig: ValueInputConfig;
}

export function ConditionForm({ leftConditionConfig, operatorConfig, valueInputConfig }: Props) {
  return (
    <Paper elevation={1} sx={{ padding: '1.5rem', gap: '2rem' }}>
      <Box display="flex" gap="1rem" sx={{ height: '3.5rem', width: '100%' }}>
        <FormRow
          leftConditionConfig={leftConditionConfig}
          operatorConfig={operatorConfig}
          valueInputConfig={valueInputConfig}
        />
      </Box>
    </Paper>
  );
}

function FormRow({
  leftConditionConfig,
  operatorConfig,
  valueInputConfig,
}: Omit<Props, 'isLoading'>) {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={`${texts.leftCondition}-select-label`}>{texts.leftCondition}</InputLabel>
        <Select
          id={`${texts.leftCondition}-select-label`}
          label={texts.leftCondition}
          labelId={`${texts.leftCondition}-select-label`}
          onChange={(event) => leftConditionConfig.onChange(event.target.value)}
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
          onChange={(event) => operatorConfig.onChange(event.target.value)}
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
        onChange={(event) => valueInputConfig.onChange(event.target.value)}
      />
      <Box display="flex">
        <IconButton color="primary" size="large">
          <AddIcon />
        </IconButton>
        <IconButton color="warning" size="large">
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
}
