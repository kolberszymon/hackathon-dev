import MetaMaskButton from "../components/ConnectMetamaskButton";
import { useEthContext } from "../context/EthereumContext";
import { useState, useEffect, useRef } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import { currentChainInfo } from "../constants/addresses";
import { Viewer } from "../../viewer/viewer.js";


type NftItem = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
};

export default function Home() {
  const { accounts, provider, currentAcc } = useEthContext();
  const [nfts, setNfts] = useState<Array<NftItem>>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const containerRef = useRef(null);

  useEffect(() => {
    initThreeJs();
  }, [])

  useEffect(() => {
    // If there's no account connected -> do nothing
    if (!currentAcc) {
      return;
    }
    
    // fetchNftByOwner();
  }, [currentAcc]);

  const initThreeJs = async () => {
    console.log(containerRef.current);
    const viewer = new Viewer(containerRef.current);
    console.log(viewer);

    viewer.loadObj("/citychain.obj", false);
    viewer.loadObj("/homechain_02.obj", true);
  }

  const fetchNftByOwner = async () => {
    // Get nft by owner https://api-reference.rarible.com/#operation/getNftItemsByOwner
    const { data }: any = await axios.get(
      currentChainInfo.apiDomain + "/protocol/v0.1/ethereum/nft/items/byOwner",
      {
        params: {
          owner: currentAcc,
        },
      }
    );

    setIsLoading(false);

    //Filtering fetched items by properties we need
    // There's no sense in having them all
    let fetchedItems: Array<NftItem> = data.items.map((item) => {
      return {
        id: item.id,
        name: item.meta.name,
        imageUrl: item.meta.image?.url.ORIGINAL,
        description: item.meta.description,
      };
    });

    setNfts(fetchedItems);
    console.log(fetchedItems);
  };

  const handleConnectWallet = async () => {
    await provider.request({ method: `eth_requestAccounts` });
  };

  const handleSelectNft = () => {};

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen w-screen justify-center relative">
      <MetaMaskButton onClick={handleConnectWallet} accounts={accounts} />
      <div className="absolute flex h-full w-full justify-center">
        <div ref={containerRef} className="w-full border-l-2 box-border bg-gray-500"></div>
      </div>
    </div>
  );
}
