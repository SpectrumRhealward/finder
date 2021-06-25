import {
  provideLiquidityRule,
  withdrawLiquidityRule,
  //ustToTokenSwapRule,
  //tokenToUstSwapRule,
  transferRule
} from "../logPatterns/token-logs-rule";
import { LogFindersRuleSet } from "../types";

export const tokenRuleSet = () => {
  const provideLiquidityRuleSet: LogFindersRuleSet = {
    rule: provideLiquidityRule(),
    transform: (fragment, matched) => ({
      msgType: "token/provide-liquidity",
      canonicalMsg: [
        `Provide ${matched[2].value} Liquidity to ${matched[0].value}`,
        `Mint ${matched[13].value}${matched[10].value}`
      ],
      amountIn: `${matched[13].value}${matched[10].value}`,
      amountOut: `${matched[2].value}`,
      payload: fragment
    })
  };

  const withdrawLiquidityRuleSet: LogFindersRuleSet = {
    rule: withdrawLiquidityRule(),
    transform: (fragment, matched) => ({
      msgType: "token/withdraw-liquidity",
      canonicalMsg: [
        `Withdraw ${matched[8].value} Liquidity from ${matched[5].value}`,
        `Burn ${matched[17].value}${matched[14].value}`
      ],
      amountIn: `${matched[8].value}`,
      amountOut: `${matched[17].value}${matched[14].value}`,
      payload: fragment
    })
  };

  // const ustToTokenSwapRuleSet: LogFindersRuleSet = {
  //   rule: ustToTokenSwapRule(),
  //   transform: (fragment, matched) => ({
  //     msgType: "token/swap-ust-to-token",
  //     canonicalMsg: [
  //       `Swap ${matched[4].value}${matched[2].value} for ${matched[5].value}${matched[3].value}`
  //     ],
  //     amountIn: `${matched[5].value}${matched[3].value}`,
  //     amountOut: `${matched[4].value}${matched[2].value}`,
  //     payload: fragment
  //   })
  // };

  // const tokenToUstSwapRuleSet: LogFindersRuleSet = {
  //   rule: tokenToUstSwapRule(),
  //   transform: (fragment, matched) => ({
  //     msgType: "token/swap-token-to-ust",
  //     canonicalMsg: [
  //       `Swap ${matched[9].value}${matched[7].value} for ${matched[10].value}${matched[8].value}`
  //     ],
  //     amountIn: `${matched[10].value}${matched[8].value}`,
  //     amountOut: `${matched[9].value}${matched[7].value}`,
  //     payload: fragment
  //   })
  // };

  const transferRuleSet: LogFindersRuleSet = {
    rule: transferRule(),
    transform: (fragment, matched) => ({
      msgType: "token/transfer",
      canonicalMsg: [
        `Transfer ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      payload: fragment
    })
  };

  return [
    provideLiquidityRuleSet,
    withdrawLiquidityRuleSet,
    //ustToTokenSwapRuleSet,
    //tokenToUstSwapRuleSet,
    transferRuleSet
  ];
};
