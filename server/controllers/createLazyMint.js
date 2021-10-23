import axios from "axios";

export async function generateTokenId(contract, minter) {
  console.log("generating tokenId for", contract, minter);
  const raribleTokenIdUrl = `${apiDomain}/protocol/v0.1/ethereum/nft/collections/${contract}/generate_token_id?minter=${minter}`;
  const { data } = await axios.get(raribleTokenIdUrl);

  const { tokenId } = data;

  return tokenId;
}

export async function createLazyMintForm(tokenId, contract, minter, ipfsHash) {
  // const tokenId = await generateTokenId(contract, minter)
  console.log("generated tokenId", tokenId);
  return {
    "@type": "ERC721",
    contract,
    tokenId,
    uri: `/ipfs/${ipfsHash}`,
    creators: [{ account: minter, value: 10000 }],
    royalties: [],
  };
}
