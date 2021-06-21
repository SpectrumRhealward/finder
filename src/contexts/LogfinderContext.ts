import React from "react";
import { anchorRuleSet } from "../logfinder/rule-set/anchor-rule-set";
import { mirrorRuleSet } from "../logfinder/rule-set/mirror-rule-set";
import { terraRuleSet } from "../logfinder/rule-set/terra-rule-set";
import { tokenRuleSet } from "../logfinder/rule-set/token-rule-set";
import { DEFAULT_NETWORK } from "../scripts/utility";

const LogfinderContext = React.createContext({
  ruleArray: [
    anchorRuleSet(DEFAULT_NETWORK),
    mirrorRuleSet(DEFAULT_NETWORK),
    terraRuleSet(),
    tokenRuleSet()
  ].flat()
});

export default LogfinderContext;
