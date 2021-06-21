import { useContext } from "react";
import { Dictionary } from "ramda";
import c from "classnames";
import { AccAddress } from "@terra-money/terra.js";
import contracts from "../components/contracts.json";
import NetworkContext from "../contexts/NetworkContext";
import Finder from "./Finder";
import s from "./Address.module.scss";
import format from "../scripts/format";

type Data = Dictionary<{ name: string; icon: string }>;

type Prop = {
  address: string;
  hideIcon?: boolean;
  truncate?: boolean;
  className?: string;
};

const formatAccAddress = (
  chainId: string,
  address: string,
  hideIcon?: boolean,
  truncate?: boolean,
  className?: string
) => {
  const whitelist = (contracts as Dictionary<Data>)[chainId];
  const data = whitelist?.[address];

  const renderAddress = truncate ? format.truncate(address, [8, 8]) : address;

  return (
    <div className={c(s.wrapper, className)}>
      {data ? (
        <>
          <Finder q="address" v={address} children={data.name} />
          {hideIcon ? undefined : (
            <img src={data.icon} alt={data.name} className={s.icon} />
          )}
        </>
      ) : (
        <Finder q="address" v={address} children={renderAddress} />
      )}
    </div>
  );
};

const formatValidatorAddress = (
  address: string,
  truncate?: boolean,
  className?: string
) => {
  const renderAddress = truncate ? format.truncate(address, [8, 8]) : address;

  return (
    <div className={c(s.wrapper, className)}>
      <Finder q="validator" v={address} children={renderAddress} />
    </div>
  );
};

const Address = ({ address, hideIcon, truncate, className }: Prop) => {
  const { network: currentChain } = useContext(NetworkContext);

  if (AccAddress.validate(address)) {
    return formatAccAddress(
      currentChain,
      address,
      hideIcon,
      truncate,
      className
    );
  } else {
    return formatValidatorAddress(address, truncate, className);
  }
};

export default Address;
