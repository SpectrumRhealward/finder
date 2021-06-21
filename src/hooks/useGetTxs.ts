import { filter } from "lodash";
import { useEffect, useState } from "react";
import { useRequest } from "../HOCs/WithFetch";

type TxsResult = {
  limit: number;
  txs: TxResponse[];
  next?: number;
};

const useGetTxs = (
  startDate: Date,
  endDate: Date,
  address: string,
  chainId: string,
  offset: number = 0
) => {
  const { data } = useRequest({
    url: `/v1/txs?offset=${offset}&limit=500&account=${address}&chainId=${chainId}`
  });

  const [result, setResult] = useState<TxsResult>();

  useEffect(() => {
    data && setResult(data);
  }, [data]);

  if (result) {
    const txs = filter(result.txs, tx => {
      const txDate = new Date(tx.timestamp);
      return (
        txDate.valueOf() >= startDate.valueOf() &&
        txDate.valueOf() <= endDate.valueOf()
      );
    });

    return txs;
  }
};

export default useGetTxs;
