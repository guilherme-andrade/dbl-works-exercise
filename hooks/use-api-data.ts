import axios from "axios";
import { useEffect, useState } from "react";

export const useApiData = <T>(
  path: string,
  defaultValue: any
): { data: T; isLoading: boolean; isError: boolean } => {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get<T>(path)
      .catch((err) => {
        setIsError(true);
        return err.response;
      })
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, isError };
};

export default useApiData;
