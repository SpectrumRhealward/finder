import { TxInfo } from "@terra-money/terra.js";
import { createLogMatcher } from "./execute";
import { LogFinderResult, LogFindersRuleSet } from "./types";

export const getTxInfo = (data: string, ruleArray: LogFindersRuleSet[]) => {
  const tx: TxInfo = JSON.parse(data);
  const logMatcher = createLogMatcher(ruleArray);

  if (tx.logs) {
    const matched: LogFinderResult[] = logMatcher(
      tx.logs.flatMap(log => log.events)
    )
      .flat()
      .filter(Boolean)
      .map(data => data && { ...data, timestamp: tx.timestamp });

    return matched.length > 0 ? matched : undefined;
  }
};
