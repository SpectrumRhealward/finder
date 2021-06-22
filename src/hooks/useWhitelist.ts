import { Dictionary } from "ramda";
import useTerraAssets from "../hooks/useTerraAssets";

const useWhitelist = (name: string) => {
  const response = useTerraAssets<Dictionary<ListedItem>>("cw20/tokens.json");
  return { ...response, whitelist: response.data?.[name] };
};

export default useWhitelist;

export interface ListedItem {
  protocol: string;
  symbol: string;
  token: string;
  icon?: string;
}
