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

interface Props {
  endpoint: string | null;
}

export function useUrlInputEndpointRequest({ endpoint }: Props) {
  const [response, setResponse] = useState<SuccessRequestResponse>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    if (!endpoint) return;

    fetch(endpoint, { cache: 'force-cache' })
      .then<ErrorResponse | SuccessRequestResponse>((requestResponse) => requestResponse.json())
      .then((requestResponse) => {
        if ('error' in requestResponse) {
          setHasError(true);
        } else {
          setResponse(requestResponse);
          setHasError(false);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, [endpoint]);

  return { hasError, isLoading, response };
}
