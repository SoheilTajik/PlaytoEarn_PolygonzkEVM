import { NextPage } from "next";
import {
  Container,
  Flex,
  Heading,
  Spinner,
  SimpleGrid,
  Card,
  Box,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import ClaimFarmer from "../components/ClaimFarmer";
import { MediaRenderer, useContractRead } from "@thirdweb-dev/react";
import { Equipped } from "../components/Equipped";

import {
  ClaimConditionInputArray,
  ConnectWallet,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";

import {
  FARMER_ADDRESS,
  TOOLS_ADDRESS,
  STAKING_ADDRESS,
  REWARD_ADDRESS,
} from "../const/adresses";

import { ethers } from "ethers";

import { Inventory } from "../components/Inventory";

const Home: NextPage = () => {
  const address = useAddress();
  const { BigNumber } = ethers;

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARD_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(
    farmercontract,
    address
  );

  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(
    toolsContract,
    address
  );

  const { data: equipedTools } = useContractRead(
    stakingContract,
    "getStakeInfo",
    [address]
  );

  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [
    address,
  ]);

  if (!address) {
    return (
      <Container maxW={"1200px"}>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Heading my={"40px"}>Welcome to Crypto Farm</Heading>
          <ConnectWallet />
        </Flex>
      </Container>
    );
  }

  if (loadingOwnedFarmers) {
    return (
      <Container maxW={"1200px"}>
        <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      </Container>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"1200px"}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"1200px"}>
      <SimpleGrid column={2} spacing={10}>
        <Card p={5}>
          <Heading>Farmer: </Heading>
          <SimpleGrid column={2} spacing={10}>
            <Box>
              {ownedFarmers?.map((nft) => (
                <div key={nft.metadata.id}>
                  <MediaRenderer
                    src={nft.metadata.image}
                    height="150px"
                    width="150px"
                  />
                </div>
              ))}
            </Box>
            <Box>
              <Text fontSize={"small"} fontWeight={"bold"}>
                $CARROT Balance:
              </Text>
              {rewardBalance && (
                <p>{ethers.utils.formatUnits(rewardBalance, 18)}</p>
              )}
            </Box>
          </SimpleGrid>
        </Card>
        <Card p={5}>
          <Heading>Inventory: </Heading>
          <Skeleton isLoaded={!loadingOwnedTools}>
            <Inventory nft={ownedTools} />
          </Skeleton>
        </Card>
      </SimpleGrid>
      <Card p={5} my={10}>
        <Heading mb={"30px"}>Equiped Tools: </Heading>
        <SimpleGrid column={3} spacing={10}>
          {equipedTools &&
            equipedTools[0].map((nft: ethers.BigNumber) => (
              <Equipped key={nft.toNumber()} tokenId={nft.toNumber()} />
            ))}
        </SimpleGrid>
        1
      </Card>
    </Container>
  );
};

export default Home;
