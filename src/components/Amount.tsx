import React from "react";
import c from "classnames";
import format from "../scripts/format";
import s from "./Amount.module.scss";
import contracts from "../components/contracts.json";
import { isTerraAddress } from "../scripts/utility";
import { useNetwork } from "../HOCs/WithFetch";
import { Dictionary } from "ramda";
import { Tokens } from "../hooks/cw20/useTokenBalance";

type Props = {
  estimated?: boolean;
  fontSize?: number;
  className?: string;
  denom?: string;
  children?: string;
};

const renderDenom = (str: string, whitelist: Tokens) => {
  if (isTerraAddress(str) && whitelist[str]) {
    return whitelist[str].name.replace("Terraswap ", "");
  } else if (format.denom(str).length >= 40) {
    return "cw20Token";
  } else {
    return format.denom(str);
  }
};

const Amount = (props: Props) => {
  const { estimated, fontSize, className, denom, children } = props;
  const [integer, decimal] = format.amount(children || "0").split(".");

  const network = useNetwork();
  const whitelist = (contracts as Dictionary<Tokens>)[network];

  return (
    <span className={c(s.component, className)} style={{ fontSize }}>
      {estimated && "≈ "}
      {integer}
      <small>
        .{decimal}
        {denom && ` ${renderDenom(denom, whitelist)}`}
      </small>
    </span>
  );
};

export default Amount;
