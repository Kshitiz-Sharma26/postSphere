import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";

const useApiCall = <T, P = undefined>(
  api: (options: P) => Promise<
    AxiosResponse<{
      data: T;
      message?: string;
    }>
  >
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData(options: P) {
    setLoading(true);
    try {
      const resp = await api(options);
      if (resp.data) {
        setData(resp.data?.data);
      }
      return {
        status: true,
        data: resp.data?.data,
      };
    } catch (err: unknown) {
      let message;
      if (err instanceof AxiosError) {
        message = err.response?.data.message;
        setError(err.response?.data.message);
      } else {
        message = "An unknown error occured";
        setError("An unknown error occured");
      }
      return {
        status: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  }
  return { fetchData, loading, data, error };
};

export default useApiCall;
