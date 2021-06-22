import { useContext } from "react";
import CurrencyContext from "../../contexts/CurrencyContext";
import { useRequest } from "../../HOCs/WithFetch";
import useNativeDenoms from "../../hooks/useNativeDenoms";
import { DEFAULT_CURRENCY } from "../../scripts/utility";
import Available from "./Available";

const AvailableList = ({ list }: { list: Balance[] }) => {
  const { currency } = useContext(CurrencyContext);
  const denoms = useNativeDenoms();
  const denom = denoms?.includes(currency) ? currency : DEFAULT_CURRENCY;

  const response = useRequest({
    url: `/v1/market/swaprate/${denom}`
  });

  return (
    <>
      {list.map((a, i) => (
        <Available
          {...a}
          key={i}
          currency={{ response: response, currency: denom }}
        />
      ))}
    </>
  );
};

export default AvailableList;
