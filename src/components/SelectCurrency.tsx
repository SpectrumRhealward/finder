import { useContext, useEffect } from "react";
import CurrencyContext from "../contexts/CurrencyContext";
import s from "./SelectCurrency.module.scss";
import { getCookie } from "../scripts/cookie";
import { DEFAULT_CURRENCY, getDefaultCurrency } from "../scripts/utility";
import useNativeDenoms from "../hooks/useNativeDenoms";

type Props = {
  className?: string;
};

const SelectCurrency = (props: Props) => {
  const { currency, selectCurrency } = useContext(CurrencyContext);
  const denoms = useNativeDenoms();
  const denom = denoms?.includes(currency) ? currency : DEFAULT_CURRENCY;

  useEffect(() => {
    if (!getCookie("currency") && denoms && navigator.cookieEnabled) {
      const currency = getDefaultCurrency(denoms);
      selectCurrency(currency);
    }
  }, [selectCurrency, denoms]);

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={denom.substr(1).toUpperCase()}
        onChange={e => selectCurrency(`u${e.target.value}`.toLowerCase())}
      >
        {denoms?.map((currency, key) => {
          const activeDenom = currency.substr(1).toUpperCase();
          return <option key={key}>{activeDenom}</option>;
        })}
      </select>
      <div className={s.addon}>
        <i className="material-icons">arrow_drop_down</i>
      </div>
    </div>
  );
};

export default SelectCurrency;
