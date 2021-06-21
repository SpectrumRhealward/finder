import "react-app-polyfill/ie9";
import "core-js";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import "./index.scss";
import App from "./layouts/App";
import NetworkContext from "./contexts/NetworkContext";
import CurrencyContext from "./contexts/CurrencyContext";
import LogfinderContext from "./contexts/LogfinderContext";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import { DEFAULT_CURRENCY, DEFAULT_NETWORK } from "./scripts/utility";
import { getCookie, setCookie } from "./scripts/cookie";
import { anchorRuleSet } from "./logfinder/rule-set/anchor-rule-set";
import { mirrorRuleSet } from "./logfinder/rule-set/mirror-rule-set";
import { terraRuleSet } from "./logfinder/rule-set/terra-rule-set";
import { tokenRuleSet } from "./logfinder/rule-set/token-rule-set";

if (
  process.env.REACT_APP_SENTRY_DSN &&
  /^http/.test(process.env.REACT_APP_SENTRY_DSN)
) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

const Root = () => {
  const { push } = useHistory();
  const location = useLocation();
  const network = location.pathname.split("/")[1] || DEFAULT_NETWORK;
  const selectNetwork = (network: string) => {
    const pathnames = location.pathname.split("/");
    pathnames[1] = network;
    push(pathnames.join("/"));
  };

  const defaultCurrency = getCookie("currency") || DEFAULT_CURRENCY;
  const [currency, setCurrency] = useState(defaultCurrency);
  const selectCurrency = (currency: string) => {
    setCookie("currency", currency, 7);
    setCurrency(currency);
  };

  const ruleArray = [
    anchorRuleSet(network),
    mirrorRuleSet(network),
    terraRuleSet(),
    tokenRuleSet()
  ].flat();

  return (
    <NetworkContext.Provider value={{ network, selectNetwork }}>
      <CurrencyContext.Provider value={{ currency, selectCurrency }}>
        <LogfinderContext.Provider value={{ ruleArray }}>
          <Switch>
            <App />
          </Switch>
        </LogfinderContext.Provider>
      </CurrencyContext.Provider>
    </NetworkContext.Provider>
  );
};

ReactDOM.render(
  <Router>
    <Root />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
