import {
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
  useNFT,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/adresses";
import styles from "../styles/Home.module.css";
import { Text, Box, Card, Flex, Stack, StylesProvider } from "@chakra-ui/react";

interface EquipedProps {
  tokenId: number;
}

export const Equipped = (props: EquipedProps) => {
  const address = useAddress();

  const { contract: StakingContract } = useContract(STAKING_ADDRESS);
  const { contract: toolContract } = useContract(TOOLS_ADDRESS);

  const { data: nft } = useNFT(toolContract, props.tokenId);

  const { data: claimRewards } = useContractRead(
    StakingContract,
    "getStakeInfoForToken",
    [props.tokenId, address]
  );

  return (
    <Box>
      {nft && (
        <Card className={styles.equipcontainer} p={5}>
          <Flex>
            <Box>
              <MediaRenderer
                src={nft.metadata.image}
                height="100px"
                width="100px"
              />
            </Box>
            <Stack spacing={1}>
              <Text fontSize={"2xl"} fontWeight={"bold"}>
                {nft.metadata.name}
              </Text>
              <Text>
                Equiped: {ethers.utils.formatUnits(claimRewards[0], 0)}
              </Text>
              <Web3Button
                contractAddress={STAKING_ADDRESS}
                action={(contract) =>
                  contract.call("withdraw", [props.tokenId, 1])
                }
                className={styles.equipbutton}
              >
                Unequiped
              </Web3Button>
            </Stack>
          </Flex>
          <Box mt={5}>
            <Text>Claimable $CARROT:</Text>
            <Text>{ethers.utils.formatUnits(claimRewards[1], 18)}</Text>
            <Web3Button
              contractAddress={STAKING_ADDRESS}
              action={(contract) =>
                contract.call("claimRewards", [props.tokenId])
              }
            >
              Claim $CARROT
            </Web3Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};
