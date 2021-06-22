import { useContext } from "react";
import { path } from "ramda";
import { format as formatDate } from "date-fns";
import { map } from "lodash";
import { getTxInfo } from "../logfinder/format";
import LogfinderContext from "../contexts/LogfinderContext";
import { useNetwork } from "../HOCs/WithFetch";
import { transformChainId } from "../scripts/utility";
import format from "../scripts/format";
import { LogFinderResult } from "../logfinder/types";
import useWhitelist from "./useWhitelist";
import useGetTxs from "./useGetTxs";
import useNativeDenoms from "./useNativeDenoms";

interface Column {
  dataIndex: string[];
  title: string;
  render?: (value: string, tx: any) => string;
}

const HEAD = "data:text/csv;charset=utf-8";

const useDownloadCSV = (address: string, startDate: Date, endDate: Date) => {
  const chainId = useNetwork();
  const txs = useGetTxs(startDate, endDate, address, chainId);
  const { ruleArray } = useContext(LogfinderContext);
  const logArray = txs?.map(tx => getTxInfo(JSON.stringify(tx), ruleArray));
  const network = transformChainId(chainId);

  const denoms = useNativeDenoms()
    ?.map(denom => format.denom(denom))
    .concat("Luna");

  const { whitelist } = useWhitelist(network);
  const list = whitelist && Object.values(whitelist)?.map(data => data);
  const symbolAndDenoms = map(list, "symbol").concat(denoms);

  const denomColumns: Column[] = symbolAndDenoms.map(str => ({
    dataIndex: [""],
    title: str
  }));
  const defaultColumns: Column[] = [
    {
      dataIndex: ["timestamp"],
      title: "datetime",
      render: value => formatDate(new Date(value), "M/d/yyyy H:mm")
    }
  ];

  const all = {
    children: "CSV",
    href: logArray && createCSV([...defaultColumns, ...denomColumns], logArray)
  };

  return all;
};

export default useDownloadCSV;

const createCSV = (
  columns: Column[],
  logArray: (LogFinderResult[] | undefined)[]
) => {
  const headings = columns.map(({ title }) => title);

  if (logArray) {
    const rowArray = logArray.map(
      log =>
        log &&
        log.map(data =>
          columns.map(({ dataIndex, render }) => {
            const value = path(
              dataIndex,
              dataIndex[0] === "timestamp" ? data : data.transformed
            ) as string;
            return render?.(value, data) ?? value;
          })
        )
    );

    const content = rowArray
      .filter(rows => rows !== undefined)
      .flat() //transaction have multiple message
      .map(rows => rows?.join(","));
    const csv = content && [HEAD, [headings, ...content].join("\n")].join();

    if (csv && content?.length !== 0) {
      return encodeURI(csv);
    }
  }
};
