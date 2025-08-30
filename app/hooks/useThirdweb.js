import { useMemo } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { useLogger } from "./useLogger";
import { getThirdwebChain } from "./useChainSwitch";

export function useThirdweb() {
  const { addLog } = useLogger();

  const client = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
      addLog("Thirdweb client ID missing", "error");
      return null;
    }
    const c = createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    });
    addLog("Thirdweb client initialized", "success");
    return c;
  }, [addLog]);

  const getThirdwebContract = (address, chainId) => {
    if (!client) return null;
    const chain = getThirdwebChain(chainId);
    return getContract({ client, address, chain });
  };

  return { client, getThirdwebContract };
}
