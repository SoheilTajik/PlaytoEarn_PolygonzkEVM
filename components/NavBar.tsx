import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
  return (
    <Container maxW={"1200px"} py={4}>
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Heading>Crypto Farm</Heading>
        <Flex gap={"50px"}>
          <Link href={"/"}>Play</Link>
          <Link href={"/shop"}>Shop</Link>
        </Flex>
        <ConnectWallet />
      </Flex>
    </Container>
  );
}
