import { create } from "ipfs-http-client";

const infura = {
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  timeout: 15000,
};

const ipfs = create(infura);

export async function uploadToIPFS(object) {
  console.log("🛰  Sending to IPFS...");

  try {
    const ipfsResult = await ipfs.add(object);
    const uploadPath = ipfsResult.path;

    return uploadPath;
  } catch (err) {
    console.log(err.message);
    return "";
  }
}
