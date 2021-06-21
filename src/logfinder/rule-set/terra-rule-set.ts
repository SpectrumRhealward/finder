import {
  msgSendRule,
  msgWithdrawDelegationRewardRule,
  msgVoteRule,
  msgSubmitProposalRule,
  msgDepositRule,
  msgSwapRule,
  msgExchangeRateVoteRule,
  msgExchangeRatePrevoteRule,
  msgAggregateExchangeRateVoteRule,
  msgAggregateExchangeRatePrevoteRule,
  msgUnjailRule,
  msgUndelegateRule,
  msgEditValidatorRule,
  msgDelegateRule,
  msgCreateValidatorRule,
  msgBeginRedelegateRule,
  msgStoreCodeRule,
  msgMigrateContractRule,
  msgInstantiateContractRule
} from "../logPatterns/terra-logs-rule";
import { LogFindersRuleSet } from "../types";

export const terraRuleSet = () => {
  const msgSendRuleSet: LogFindersRuleSet = {
    rule: msgSendRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/send",
      canonicalMsg: [
        `${fragment.attributes[1].value} send ${fragment.attributes[2].value} to ${fragment.attributes[0].value}`
      ],
      payload: fragment
    })
  };

  const msgWithdrawDelegationRewardRuleSet: LogFindersRuleSet = {
    rule: msgWithdrawDelegationRewardRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/withdraw-delegation-reward",
      canonicalMsg: [`Withdraw reward from ${fragment.attributes[1].value}`],
      amountIn: `${fragment.attributes[0].value}`,
      payload: fragment
    })
  };

  const msgVoteRuleSet: LogFindersRuleSet = {
    rule: msgVoteRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/vote",
      canonicalMsg: [
        `Vote ${fragment.attributes[0].value} (Proposal ID: ${fragment.attributes[1].value})`
      ],
      payload: fragment
    })
  };

  const msgSubmitProposalRuleSet: LogFindersRuleSet = {
    rule: msgSubmitProposalRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/submit-proposal",
      canonicalMsg: [
        `Create proposal (Proposal ID: ${fragment.attributes[0].value})`
      ],
      payload: fragment
    })
  };

  const msgDepositRuleSet: LogFindersRuleSet = {
    rule: msgDepositRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/deposit",
      canonicalMsg: [
        `Deposit ${fragment.attributes[0].value} (Proposal ID: ${fragment.attributes[1].value})`
      ],
      amountOut: `${fragment.attributes[0].value}`,
      payload: fragment
    })
  };

  const msgSwapRuleSet: LogFindersRuleSet = {
    rule: msgSwapRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/swap",
      canonicalMsg: [
        `Swap ${fragment.attributes[0].value} for ${fragment.attributes[3].value}`
      ],
      amountIn: `${fragment.attributes[3].value}`,
      amountOut: `${fragment.attributes[0].value}`,
      payload: fragment
    })
  };

  const msgExchangeRateVoteRuleSet: LogFindersRuleSet = {
    rule: msgExchangeRateVoteRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/exchange-rate-vote",
      canonicalMsg: [`???`],
      payload: fragment
    })
  };

  const msgExchangeRatePrevoteRuleRuleSet: LogFindersRuleSet = {
    rule: msgExchangeRatePrevoteRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/exchange-rate-prevote",
      canonicalMsg: [`???`],
      payload: fragment
    })
  };

  const msgAggregateExchangeRateVoteRuleSet: LogFindersRuleSet = {
    rule: msgAggregateExchangeRateVoteRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/aggregate-exchange-rate-vote",
      canonicalMsg: [`???`],
      payload: fragment
    })
  };

  const msgAggregateExchangeRatePrevoteRuleSet: LogFindersRuleSet = {
    rule: msgAggregateExchangeRatePrevoteRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/aggregate-exchange-rate-prevote",
      canonicalMsg: [`???`],
      payload: fragment
    })
  };

  const msgUnjailRuleSet: LogFindersRuleSet = {
    rule: msgUnjailRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/unjail",
      canonicalMsg: [`Unjail ${fragment.attributes[2].value}`],
      payload: fragment
    })
  };

  const msgUndelegateRuleSet: LogFindersRuleSet = {
    rule: msgUndelegateRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/undelegete",
      canonicalMsg: [
        `Undelegete ${fragment.attributes[1].value}uluna to ${fragment.attributes[0].value}`
      ],
      amountIn: `${fragment.attributes[1].value}uluna`,
      payload: fragment
    })
  };

  const msgEditValidatorRuleSet: LogFindersRuleSet = {
    rule: msgEditValidatorRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/edit-validator",
      canonicalMsg: [`Edit ${fragment.attributes[2].value}`],
      payload: fragment
    })
  };

  const msgDelegateRuleSet: LogFindersRuleSet = {
    rule: msgDelegateRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/delegate",
      canonicalMsg: [
        `Delegate ${fragment.attributes[1].value}uluna to ${fragment.attributes[0].value}`
      ],
      amountOut: `${fragment.attributes[1].value}uluna`,
      payload: fragment
    })
  };

  const msgCreateValidatorRuleSet: LogFindersRuleSet = {
    rule: msgCreateValidatorRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/create-validator",
      canonicalMsg: [`Create ${fragment.attributes[0].value}`],
      payload: fragment
    })
  };

  const msgBeginRedelegateRuleSet: LogFindersRuleSet = {
    rule: msgBeginRedelegateRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/begin-redelegate",
      canonicalMsg: [
        `Redelegate ${fragment.attributes[2].value} to ${fragment.attributes[1].value}`
      ],
      payload: fragment
    })
  };

  const msgStoreCodeRuleSet: LogFindersRuleSet = {
    rule: msgStoreCodeRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/store-code",
      canonicalMsg: [`Store ${fragment.attributes[1].value}`],
      payload: fragment
    })
  };

  const msgMigrateContractRuleSet: LogFindersRuleSet = {
    rule: msgMigrateContractRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/migrate-contract",
      canonicalMsg: [
        `Migrate ${fragment.attributes[1].value} to code ${fragment.attributes[0].value}`
      ],
      payload: fragment
    })
  };

  const msgInstantiateContractRuleSet: LogFindersRuleSet = {
    rule: msgInstantiateContractRule(),
    transform: (fragment, matched) => ({
      msgType: "terra/instantiate-contract",
      canonicalMsg: [
        `Instantiate ${fragment.attributes[2].value} to code ${fragment.attributes[1].value}`
      ],
      payload: fragment
    })
  };

  return [
    msgSendRuleSet,
    msgWithdrawDelegationRewardRuleSet,
    msgVoteRuleSet,
    msgSubmitProposalRuleSet,
    msgDepositRuleSet,
    msgSwapRuleSet,
    msgExchangeRateVoteRuleSet,
    msgExchangeRatePrevoteRuleRuleSet,
    msgAggregateExchangeRateVoteRuleSet,
    msgAggregateExchangeRatePrevoteRuleSet,
    msgUnjailRuleSet,
    msgUndelegateRuleSet,
    msgEditValidatorRuleSet,
    msgDelegateRuleSet,
    msgCreateValidatorRuleSet,
    msgBeginRedelegateRuleSet,
    msgStoreCodeRuleSet,
    msgMigrateContractRuleSet,
    msgInstantiateContractRuleSet
  ];
};
