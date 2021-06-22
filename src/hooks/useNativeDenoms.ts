import { useRequest } from "../HOCs/WithFetch";

const useNativeDenoms = () => {
  const response: ActiveDenom = useRequest({ url: `/oracle/denoms/actives` });
  return response.data?.result;
};

export default useNativeDenoms;
