import { useEffect, useState } from 'react';

type ErrorResponse = {
  code: string;
  error: boolean;
  message: string;
};

export type SuccessRequestResponsePossibleValues =
  | string
  | Record<string, unknown>
  | Array<unknown>;
export type SuccessRequestResponse = Array<Record<string, SuccessRequestResponsePossibleValues>>;

enum RequestStatus {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Loading = 'LOADING',
}

interface Props {
  endpoint: string | null;
}

export function useUrlInputEndpointRequest({ endpoint }: Props) {
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Loading);
  const [response, setResponse] = useState<SuccessRequestResponse>([]);

  useEffect(() => {
    if (!endpoint) return setStatus(RequestStatus.Loading);

    fetch(endpoint, { cache: 'force-cache' })
      .then<ErrorResponse | SuccessRequestResponse>((requestResponse) => requestResponse.json())
      .then((requestResponse) => {
        if ('error' in requestResponse || !Array.isArray(requestResponse)) {
          setStatus(RequestStatus.Error);
        } else {
          setResponse(requestResponse);
          setStatus(RequestStatus.Success);
        }
      })
      .catch(() => {
        setStatus(RequestStatus.Error);
      });
  }, [endpoint]);

  return {
    response,
    hasError: status === RequestStatus.Error,
    isLoading: status === RequestStatus.Loading,
    isSuccess: status === RequestStatus.Success,
  };
}
