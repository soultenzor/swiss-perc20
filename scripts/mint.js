const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Функция для отправки шифрованной транзакции
const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Адрес развернутого PERC20 контракта
  const contractAddress = "0xabe58a94A370CBbC636C6d9355122F07305535aD";
  
  // Получаем подписанта (ваш аккаунт)
  const [signer] = await hre.ethers.getSigners();
  
  // Создаем экземпляр контракта
  const contractFactory = await hre.ethers.getContractFactory("SoulPERC20");
  const contract = contractFactory.attach(contractAddress);
  
  // Количество SWTR для отправки (это будет количество минченных PERC20 токенов)
  const amountToMint = hre.ethers.parseEther("0.01"); // 0.01 SWTR

  console.log(`Attempting to mint ${hre.ethers.formatEther(amountToMint)} PERC20 tokens...`);

  // Отправляем транзакцию для минта токенов
  const mintTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    "0x", // Пустые данные, так как мы вызываем receive()
    amountToMint
  );

  // Ждем подтверждения транзакции
  const receipt = await mintTx.wait();

  console.log("Mint Transaction Receipt: ", receipt);
  console.log(`Minted ${hre.ethers.formatEther(amountToMint)} PERC20 tokens`);

  // Здесь можно добавить проверку баланса, но это потребует дополнительной реализации
  // с использованием шифрования, как описано в документации
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});