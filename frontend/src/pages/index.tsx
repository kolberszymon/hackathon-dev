import MetaMaskButton from "../components/ConnectMetamaskButton";
import { useEthContext } from "../context/EthereumContext";
import { useState, useEffect, useRef } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import { currentChainInfo } from "../constants/addresses";
import { Viewer } from "../../viewer/viewer.js";
import Sidebar from "../components/sidebar";

type NftItem = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
};

let availableApartments = [
  {
    name: "Apartment #19",
    description: "Cube.042_Cube.043",
    price: "10 ETH",
    isAvailableForSell: true,
  },
  {
    name: "Apartment #20",
    description: "Cube.020_Cube.021",
    price: "15 ETH",
    isAvailableForSell: true,
  },
  {
    name: "Apartment #20",
    description: "Cube.108",
    price: "20 ETH",
    isAvailableForSell: true,
  },
  {
    name: "Apartment #20",
    description: "Cube.013_Cube.014",
    price: "30 ETH",
    isAvailableForSell: true,
  },
  {
    name: "Apartment #20",
    description: "Cube.137",
    price: "17 ETH",
    isAvailableForSell: true,
  },
];

export default function Home() {
  const developerAccount: string = "0x399B4B77538DC5b9A02319507d5E5C01B39D8607";
  const { accounts, provider, currentAcc } = useEthContext();
  const [nfts, setNfts] = useState<Array<NftItem>>();
  const [selectedApartment, setSelectedApartment] = useState<any>();
  const [apartmentData, setApartmentData] = useState<any>();

  const containerRef = useRef(null);

  useEffect(() => {
    fetchNftByOwner();
    initThreeJs();
    window.addEventListener("ApartmentChangeEvent", (event) => {
      //@ts-ignore
      setSelectedApartment(event.detail);
    });
  }, []);

  useEffect(() => {
    // If there's no account connected -> do nothing
    if (!currentAcc) {
      return;
    }

    // fetchNftByOwner();
  }, [currentAcc]);

  useEffect(() => {
    console.log(selectedApartment);

    setApartmentData(
      availableApartments.filter(
        (nft) => nft.description === selectedApartment
      )[0]
    );
  }, [selectedApartment]);

  const initThreeJs = async () => {
    const viewer = new Viewer(containerRef.current);

    // @ts-ignore
    viewer.loadObj("/citychain.obj", false);
    // @ts-ignore
    viewer.loadObj("/homechain_02.obj", true);

    viewer.createListOfAvailableFlats(availableApartments);
  };

  const fetchNftByOwner = async () => {
    console.log("fetching");
    // Get nft by owner https://api-reference.rarible.com/#operation/getNftItemsByOwner
    const { data }: any = await axios.get(
      currentChainInfo.apiDomain + "/protocol/v0.1/ethereum/nft/items/byOwner",
      {
        params: {
          owner: developerAccount,
        },
      }
    );

    console.log(data.items);

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
      <Sidebar data={apartmentData} />
      <MetaMaskButton onClick={handleConnectWallet} accounts={accounts} />
      <div className="absolute flex h-full w-full justify-center">
        <div
          ref={containerRef}
          className="w-full border-l-2 box-border bg-gray-500"
        ></div>
      </div>
    </div>
  );
}
