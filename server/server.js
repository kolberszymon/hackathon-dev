import express from "express";
import cors from "cors";
import {
  uploadToIPFS,
  generateTokenId,
  createLazyMintForm,
} from "./controllers/uploadToIpfs";

const PORT = process.env.PORT || 8080;

const app = express();

let corsOption = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOption));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.post("/get-hash-token-id", (req, res) => {
  // Request body
  // @param obj -> Json object
  // @param contractAddress -> address of contract
  // @param accountAddress -> user wallet address

  const { obj, contractAddress, accountAddress } = req.body;

  const ipfsHash = uploadToIPFS(obj);
  const tokenId = generateTokenId(ipfsHash);
  const lazyMintForm = createLazyMintForm(
    tokenId,
    contractAddress,
    accountAddress,
    ipfsHash
  );

  res.status(200).send({ ipfsHash, tokenId, lazyMintForm });
});

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
