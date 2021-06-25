import React, { useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { get, last, isArray, isObject } from "lodash";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";
import Loading from "../../components/Loading";
import LogfinderContext from "../../contexts/LogfinderContext";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import { getMatchLog } from "../../logfinder/format";
import { LogFindersRuleSet } from "../../logfinder/types";
import LogFormat from "./LogFormat";
import s from "./Tx.module.scss";

function isSendTx(response: TxResponse) {
  const type = get(response, "tx.value.msg[0].type");
  return [`MsgMultiSend`, `MsgSend`].includes(sliceMsgType(type));
}

function getAmountAndDenom(tax: string) {
  const result = /-?\d*\.?\d+/g.exec(tax);

  if (!result) {
    return {
      amount: 0,
      denom: ""
    };
  }

  return {
    amount: +result[0],
    denom: tax.slice(result[0].length)
  };
}

function getAction(txResponse: TxResponse, ruleArray: LogFindersRuleSet[]) {
  const tx = JSON.stringify(txResponse);
  const msg: string[] = [];
  const info = getMatchLog(tx, ruleArray);

  info?.forEach(data => {
    if (data.transformed) {
      data.transformed.canonicalMsg.forEach((str: string) => {
        if (!str.includes("undefined")) {
          msg.push(str);
        }
      });
    }
  });

  const renderData = msg;
  return renderData.filter((str, index) => renderData.indexOf(str) === index);
}

function getTotalTax(txResponse: TxResponse) {
  const logs = get(txResponse, "logs");

  if (!isArray(logs)) {
    return `0 Luna`;
  }

  const result: { [key: string]: number } = {};

  logs.forEach(log => {
    if (!isObject(log)) {
      return;
    }

    try {
      const tax = get(log, "log.tax");

      if (typeof tax !== "string" || tax.length === 0) {
        return;
      }

      tax.split(",").forEach(tax => {
        const { amount, denom } = getAmountAndDenom(tax);

        if (denom && amount) {
          result[denom] = amount + (result[denom] || 0);
        }
      });
    } catch (err) {
      // ignore JSON.parse error
    }
  });

  const keys = Object.keys(result);

  if (!keys.length) {
    return `0 Luna`;
  }

  return keys
    .map(
      denom =>
        `${format.coin({
          amount: result[denom].toString(),
          denom
        })}`
    )
    .join(", ");
}

function getTotalFee(txResponse: TxResponse) {
  const fee = get(txResponse, "tx.value.fee");
  const amount = fee.amount;
  const result: { [key: string]: string } = {};

  if (!amount) {
    return `0 Luna`;
  }

  amount.forEach((a: CoinData) => {
    if (!isObject(a)) {
      return;
    }

    try {
      result[a.denom] = a.amount;
    } catch (err) {
      // ignore JSON.parse error
    }
  });

  const keys = Object.keys(result);

  if (!keys.length) {
    return `0 Luna`;
  }

  return keys
    .map(
      denom =>
        `${format.coin({
          amount: result[denom],
          denom
        })}`
    )
    .join(", ");
}

const Txs = (props: RouteComponentProps<{ hash: string }>) => {
  const { match } = props;
  const { hash } = match.params;
  const { ruleArray } = useContext(LogfinderContext);

  return (
    <WithFetch url={`/v1/tx/${hash}`} loading={<Loading />}>
      {(response: TxResponse) => (
        <>
          <h2 className="title">Transaction Details</h2>

          <div className={s.list}>
            <div className={s.row}>
              <div className={s.head}>Transaction hash</div>
              <div className={s.body}>
                <div>
                  {response.txhash}
                  <Copy
                    text={response.txhash}
                    style={{ display: "inline-block", position: "absolute" }}
                  />
                </div>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Status</div>
              <div className={s.body}>
                {!response.code ? (
                  <span className={s.success}>Success</span>
                ) : (
                  <>
                    <p className={s.fail}>Failed</p>
                    <p className={s.failedMsg}>
                      {get(last(response.logs), "log.message") ||
                        get(response, "raw_log")}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Network</div>
              <div className={s.body}>{response.chainId}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Block</div>
              <div className={s.body}>
                <Finder q="blocks" v={response.height}>
                  {response.height}
                </Finder>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Timestamp</div>
              <div className={s.body}>
                {fromISOTime(response.timestamp.toString())}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Transaction fee</div>
              <div className={s.body}>{getTotalFee(response)}</div>
            </div>
            {isSendTx(response) && (
              <div className={s.row}>
                <div className={s.head}>Tax</div>
                <div className={s.body}>{getTotalTax(response)}</div>
              </div>
            )}
            <div className={s.row}>
              <div className={s.head}>Gas (Used/Requested)</div>
              <div className={s.body}>
                {parseInt(response.gas_used).toLocaleString()}/
                {parseInt(response.gas_wanted).toLocaleString()}
              </div>
            </div>
            {getAction(response, ruleArray).length ? (
              <div className={s.row}>
                <div className={s.head}>Action</div>
                <div className={s.action}>
                  {getAction(response, ruleArray)?.map(
                    (action, key) =>
                      action && <LogFormat actionStr={action} key={key} />
                  )}
                </div>
              </div>
            ) : undefined}
            <div className={s.row}>
              <div className={s.head}>Memo</div>
              <div className={s.body}>
                {response.tx.value.memo ? response.tx.value.memo : "-"}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Message</div>
              <div className={s.body}>
                {response.tx.value.msg.map((msg, index) => (
                  <MsgBox msg={msg} log={response.logs?.[index]} key={index} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </WithFetch>
  );
};

export default Txs;
