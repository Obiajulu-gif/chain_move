// web3/requestClient.js
import { RequestNetwork } from "@requestnetwork/request-client.js";

export const createRequestClient = (signer) => {
  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://goerli.gateway.request.network/",
    },
    signatureProvider: signer
      ? {
          sign: async (data) => {
            return {
              signer: await signer.getAddress(),
              signature: await signer.signMessage(data),
            };
          },
        }
      : undefined,
  });
};
