import {
  ReturningLogFinderTransformer,
  LogFinderRule,
  LogFragment
} from "@terra-money/log-finder";

interface TransformResult {
  msgType: string;
  canonicalMsg: string[];
  payload: LogFragment;
  amountIn?: string;
  amountOut?: string;
}

export interface LogFindersRuleSet {
  rule: LogFinderRule;
  transform: ReturningLogFinderTransformer<TransformResult>;
}
