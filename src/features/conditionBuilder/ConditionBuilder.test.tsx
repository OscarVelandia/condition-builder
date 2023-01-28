import { ConditionBuilder } from '@features/conditionBuilder';
import { describe, test } from '@jest/globals';
import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { EndpointInputTexts } from './EndpointInput';

describe('<ConditionBuilder />', () => {
  test('Should render endpoint input', async () => {
    const { getByLabelText } = render(<ConditionBuilder />);
    const EndpointInput = getByLabelText(EndpointInputTexts.url);

    expect(EndpointInput).toBeInTheDocument();
  });

  test('Should render <FormLoading /> and when is unmounted render <ConditionForm />', async () => {
    const { getByTestId } = render(<ConditionBuilder />);

    const FormLoading = getByTestId('form-loading');

    expect(FormLoading).toBeInTheDocument();

    await waitForElementToBeRemoved(FormLoading, { timeout: 5000 });

    const ConditionForm = await waitFor(() => getByTestId('condition-form'));

    expect(ConditionForm).toBeInTheDocument();
  });

  test('Should render <DataGridLoading /> and when is unmounted render <ResultDataGridaa />', async () => {
    const { getByRole, getByTestId } = render(<ConditionBuilder />);

    const DataGridLoading = getByTestId('data-grid-loading');

    expect(DataGridLoading).toBeInTheDocument();

    await waitForElementToBeRemoved(DataGridLoading, { timeout: 5000 });

    const DataGrid = await waitFor(() => getByRole('grid'));

    expect(DataGrid).toBeInTheDocument();
  });

  test('Should show loading status if no value in endpoint input', async () => {
    const { getByLabelText, getByTestId } = render(<ConditionBuilder />);
    const EndpointInput = getByLabelText(EndpointInputTexts.url);

    await waitFor(() => fireEvent.change(EndpointInput, { target: { value: '' } }));

    const FormLoading = getByTestId('form-loading');
    const DataGridLoading = getByTestId('data-grid-loading');

    expect(FormLoading).toBeInTheDocument();
    expect(DataGridLoading).toBeInTheDocument();
  });
});
