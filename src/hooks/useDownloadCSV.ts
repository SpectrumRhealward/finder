import { useContext } from "react";
import { path } from "ramda";
import { format as formatDate } from "date-fns";
import { getTxInfo } from "../logfinder/format";
import LogfinderContext from "../contexts/LogfinderContext";
import useGetTxs from "../hooks/useGetTxs";
import { useNetwork } from "../HOCs/WithFetch";

interface Column {
  dataIndex: string[];
  title: string;
  render?: (value: string, tx: any) => string;
}

const HEAD = "data:text/csv;charset=utf-8";

const useDownloadCSV = (address: string, startDate: Date, endDate: Date) => {
  const network = useNetwork();
  const txs = useGetTxs(startDate, endDate, address, network);
  const { ruleArray } = useContext(LogfinderContext);
  const logArray = txs?.map(tx => getTxInfo(JSON.stringify(tx), ruleArray));

  const defaultColumns: Column[] = [
    {
      dataIndex: ["timestamp"],
      title: "datetime",
      render: value => formatDate(new Date(value), "M/d/yyyy H:mm")
    },
    {
      dataIndex: ["msgType"],
      title: "type"
    },
    {
      dataIndex: [""],
      title: "Luna"
    },
    {
      dataIndex: [""],
      title: "KRT"
    },
    {
      dataIndex: [""],
      title: "SDT"
    },
    {
      dataIndex: [""],
      title: "UST"
    },
    {
      dataIndex: [""],
      title: "AUT"
    },
    {
      dataIndex: [""],
      title: "CAT"
    },
    {
      dataIndex: [""],
      title: "CHT"
    },
    {
      dataIndex: [""],
      title: "CNT"
    },
    {
      dataIndex: [""],
      title: "EUT"
    },
    {
      dataIndex: [""],
      title: "GBT"
    },
    {
      dataIndex: [""],
      title: "INT"
    },
    {
      dataIndex: [""],
      title: "JPT"
    },
    {
      dataIndex: [""],
      title: "MNT"
    },
    {
      dataIndex: [""],
      title: "SET"
    },
    {
      dataIndex: [""],
      title: "THT"
    },
    {
      dataIndex: [""],
      title: "MIR"
    },
    {
      dataIndex: [""],
      title: "mBTC"
    },
    {
      dataIndex: [""],
      title: "mETH"
    },
    {
      dataIndex: [""],
      title: "mGOOGL"
    },
    {
      dataIndex: [""],
      title: "mQQQ"
    },
    {
      dataIndex: [""],
      title: "mVIXY"
    },
    {
      dataIndex: [""],
      title: "mAAPL"
    },
    {
      dataIndex: [""],
      title: "mGME"
    },
    {
      dataIndex: [""],
      title: "mSPY"
    },
    {
      dataIndex: [""],
      title: "mAMC"
    },
    {
      dataIndex: [""],
      title: "mTWTR"
    },
    {
      dataIndex: [""],
      title: "mTSLA"
    },
    {
      dataIndex: [""],
      title: "mUSO"
    },
    {
      dataIndex: [""],
      title: "mAMZN"
    },
    {
      dataIndex: [""],
      title: "mIAU"
    },
    {
      dataIndex: [""],
      title: "mGLXY"
    },
    {
      dataIndex: [""],
      title: "mSLV"
    },
    {
      dataIndex: [""],
      title: "mGS"
    },
    {
      dataIndex: [""],
      title: "mBABA"
    },
    {
      dataIndex: [""],
      title: "mMSFT"
    },
    {
      dataIndex: [""],
      title: "mNFLX"
    },
    {
      dataIndex: [""],
      title: "mCOIN"
    },
    {
      dataIndex: [""],
      title: "mABNB"
    },
    {
      dataIndex: [""],
      title: "mFB"
    },
    {
      dataIndex: [""],
      title: "ANC"
    },
    {
      dataIndex: [""],
      title: "bLuna"
    },
    {
      dataIndex: [""],
      title: "aUST"
    }
  ];

  const createCSV = (columns: Column[], types: string[]) => {
    const headings = columns.map(({ title }) => title);
    if (logArray) {
      const rowArray = logArray?.map(
        log =>
          log &&
          log
            .filter(
              msg => msg.transformed && types.includes(msg.transformed.msgType)
            )
            .map(data =>
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
      return csv && content?.length !== 0 && { href: encodeURI(csv) };
    }
  };

  const allTypes = [
    "anchor/deposit-stable",
    "anchor/redeem-stable",
    "anchor/bond-luna",
    "anchor/unbond-bluna",
    "anchor/withdraw-unbonded",
    "anchor/claim-reward",
    "anchor/deposit-collateral",
    "anchor/lock-collateral",
    "anchor/unlock-collateral",
    "anchor/withdraw-collateral",
    "anchor/borrow-stable",
    "anchor/repay-stable",
    "anchor/bLuna-swap",
    "anchor/UST-swap",
    "anchor/stake-lp",
    "anchor/unstake-lp",
    "anchor/airdrop",
    "anchor/lp-staking-reward",
    "anchor/borrow-reward",
    "anchor/gov-stake",
    "anchor/gov-unstake",
    "anchor/create-poll",
    "anchor/cast-vote",
    "anchor/provide-liquidity",
    "mirror/open-position",
    "mirror/deposit",
    "mirror/withdraw",
    "mirror/burn",
    "mirror/stake-lp",
    "mirror/unstake-lp",
    "mirror/lp-staking-reward",
    "mirror/governance-stake",
    "mirror/governance-unstake",
    "mirror/create-poll",
    "mirror/cast-vote",
    "mirror/airdrop",
    "mirror/submit-order-buy",
    "mirror/submit-order-sell",
    "mirror/cancel-order",
    "mirror/execute-order-buy",
    "mirror/execute-order-sell",
    "terra/send",
    "terra/withdraw-delegation-reward",
    "terra/deposit",
    "terra/swap",
    "terra/delegate",
    "token/provide-liquidity",
    "token/withdraw-liquidity",
    "token/swap-ust-to-token",
    "token/swap-token-to-ust",
    "token/transfer"
  ];

  const all = {
    children: "All",
    ...createCSV([...defaultColumns], allTypes)
  };

  return all;
};

export default useDownloadCSV;
