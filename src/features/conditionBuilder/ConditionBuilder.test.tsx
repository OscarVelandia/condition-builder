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

  test('Should render <FormLoading /> while endpoint is requested, when request has finished render <ConditionForm />', async () => {
    const { getByTestId } = render(<ConditionBuilder />);

    const FormLoading = getByTestId('form-loading');

    expect(FormLoading).toBeInTheDocument();

    await waitForElementToBeRemoved(FormLoading, { timeout: 5000 });

    const ConditionForm = await waitFor(() => getByTestId('condition-form'));

    expect(ConditionForm).toBeInTheDocument();
  });

  test('Should render <DataGridLoading /> while endpoint is requested, when request has finished render <ResultDataGrid />', async () => {
    const { getByRole, getByTestId } = render(<ConditionBuilder />);

    const DataGridLoading = getByTestId('data-grid-loading');

    expect(DataGridLoading).toBeInTheDocument();

    await waitForElementToBeRemoved(DataGridLoading, { timeout: 5000 });

    const DataGrid = await waitFor(() => getByRole('grid'));

    expect(DataGrid).toBeInTheDocument();
  });

  test('Should show loading status when no value in endpoint input', async () => {
    const { getByLabelText, getByTestId } = render(<ConditionBuilder />);
    const EndpointInput = getByLabelText(EndpointInputTexts.url);

    await waitFor(() => fireEvent.change(EndpointInput, { target: { value: '' } }));

    const FormLoading = getByTestId('form-loading');
    const DataGridLoading = getByTestId('data-grid-loading');

    expect(FormLoading).toBeInTheDocument();
    expect(DataGridLoading).toBeInTheDocument();
  });

  // test('Should show error when request is rejected', async () => {
  //   const { getByLabelText, getByText, debug } = render(<ConditionBuilder />);
  //   const EndpointInput = getByLabelText(EndpointInputTexts.url);

  //   await waitFor(() =>
  //     fireEvent.change(EndpointInput, { target: { value: 'https://someUnavailableEndpoint.com' } }),
  //   );

  //   const ErrorMessage = await waitFor(() => getByText(EndpointInputTexts.requestErrorMessage));
  //   debug();
  //   // expect(ErrorMessage).toBeInTheDocument();
  // });

  // test('Should show error when requested data is not compatible', async () => {
  //   const { getByLabelText, getByText, debug } = render(<ConditionBuilder />);
  //   const EndpointInput = getByLabelText(EndpointInputTexts.url);

  //   await waitFor(() =>
  //     fireEvent.change(EndpointInput, {
  //       target: { value: 'https://rickandmortyapi.com/api/character' },
  //     }),
  //   );

  //   const ErrorMessage = await waitFor(() => getByText(EndpointInputTexts.requestErrorMessage));
  //   debug();

  //   // expect(ErrorMessage).toBeInTheDocument();
  // });
});
