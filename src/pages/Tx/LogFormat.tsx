import { Fragment } from "react";
import { Coin } from "@terra-money/terra.js";
import BigNumber from "bignumber.js";
import Address from "../../components/Address";
import Flex from "../../components/Flex";
import format from "../../scripts/format";
import { isFinite } from "../../scripts/math";
import s from "./LogFormat.module.scss";

type Props = {
  actionStr: string;
};

//terra Address
const TerraAddressRegExp = /(terra[0-9][a-z0-9]{38})/g;
const TerraValidatorAddressRegExp = /(terravaloper[0-9][a-z0-9]{38})/g;

//text bold
const TextBoldRegExp = /[0-9]|[^A-z]/g;

//terra denom
const NativeDenoms = ["uluna", "ukrw", "uusd", "usdr", "umnt"];
//1.020 -> 1.02
const NumberFormatRegExp = /\.?0+$/g;

const coinSet = (str: string): string => {
  if (isFinite(new BigNumber(str))) {
    return format.amount(str).replace(NumberFormatRegExp, "");
  }
  try {
    const coinData = Coin.fromString(str);
    return `${format
      .amount(coinData.amount.toString())
      .replace(NumberFormatRegExp, "")} ${format.denom(coinData.denom)}`;
  } catch {
    return NativeDenoms.includes(str) ? format.denom(str) : str;
  }
};

const assetFormat = (str: string): string => {
  if (str === ",") {
    return str;
  }

  const array = str.split(",");
  if (array.length > 1) {
    let value: string = "";

    array
      .filter(str => str !== "")
      .forEach((coin, index) => {
        value +=
          index === array.length - 1
            ? `${coinSet(coin)}`
            : `${coinSet(coin)}, `;
      });

    return value;
  } else {
    return coinSet(str);
  }
};

const LogFormat = (prop: Props) => {
  const { actionStr } = prop;
  const renderArray: JSX.Element[] = [];

  actionStr?.split(TerraAddressRegExp).forEach(str => {
    const res = str.match(TerraAddressRegExp);
    if (!res) {
      str.split(" ").forEach(string => {
        if (string) {
          const value = assetFormat(string);
          if (!value.match(TextBoldRegExp || TerraValidatorAddressRegExp)) {
            renderArray.push(<span className={s.action}>{value}</span>);
          } else if (string.match(TerraValidatorAddressRegExp)) {
            renderArray.push(
              <Address address={string} hideIcon truncate className={s.value} />
            );
          } else {
            renderArray.push(<span className={s.value}>{value}</span>);
          }
        }
      });
    } else {
      renderArray.push(
        <Address address={str} hideIcon truncate className={s.value} />
      );
    }
  });

  return (
    <Flex className={s.wrapper}>
      {renderArray.map((item, key) => (
        <Fragment key={key}>{item}</Fragment>
      ))}
    </Flex>
  );
};

export default LogFormat;
