import { ethers } from "./ethers-5.2.esm.min.js";
import { fundMeAddress, abi } from "./constants.js";

const connectBtn = document.getElementById("connectBtn");
const fundBtn = document.getElementById("fundBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const balanceBtn = document.getElementById("balanceBtn");
const balanceAmount = document.getElementById("balanceAmount");
const fundAmount = document.getElementById("fundAmount");

connectBtn.onclick = connect;
balanceBtn.onclick = showBalance;
fundBtn.onclick = fund;
withdrawBtn.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "no metamask!";
  } else {
    window.ethereum.request({ method: "eth_requestAccounts" });
    connectBtn.innerHTML = "connected";
  }
}

async function showBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(fundMeAddress);
    balanceAmount.innerHTML = ethers.utils.formatEther(balance);
  }
}
async function fund() {
  const amount = fundAmount.value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fundMe = new ethers.Contract(fundMeAddress, abi, signer);
    const sendValue = ethers.utils.parseEther(amount);
    console.log("amount is:", amount);
    console.log("sendValue is:", sendValue.toString());
    try {
      console.log("start fund");
      const txRespons = await fundMe.fund({ value: sendValue });
      await listenForTransactionMine(txRespons, provider);
      console.log("fund done!");
    } catch (e) {
      console.log(e);
    }
  }
}
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fundMe = new ethers.Contract(fundMeAddress, abi, signer);
    try {
      console.log("start withdraw");
      const txRespons = await fundMe.withdraw();
      await listenForTransactionMine(txRespons, provider);
      console.log("withdraw done!");
    } catch (e) {
      console.log(e);
    }
  }
}

function listenForTransactionMine(txResponse, provider) {
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (receipt) => {
      console.log("confirmed");
      resolve();
    });
  });
}
