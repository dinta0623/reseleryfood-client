import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Image,
  Flex,
  createStyles,
  Grid,
  Button,
  Badge,
  Group,
  Card,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "../Components/Organism/Navbar";

const useStyles = createStyles((theme) => ({
  footer: {
    padding: "2rem 0",
    background: theme.colors.brand[5],
    borderTop: ".05rem",
    borderTopColor: theme.colors.gray[2],
    borderTopStyle: "solid",
  },
}));

const Home = (props) => {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const { classes } = useStyles();

  // useEffect(() => {
  //   (async function test() {
  //     console.log("test");
  //     console.log(await useStorage("credentials"));
  //   })();
  // }, []);

  return (
    <>
      <div className="dotted">
        <Navbar />
        <br />
      </div>

      <AtomsContainer>
        <Grid direction="column" py=".5rem" my="0" gutter="xl" justify="center">
          {Array.from({ length: 10 }).map((item, idx) => (
            <Grid.Col key={idx} span={$isMobile ? 12 : 4}>
              <Card shadow="sm" p="lg">
                <Card.Section
                  component="a"
                  href="https://mantine.dev"
                  target="_blank"
                >
                  <Image
                    src="https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/5474d317-d794-4ef3-b370-5de2a5fd3f55_Go-Biz_20221226_150811.jpeg?auto=format"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group
                  position="apart"
                  style={{ marginBottom: 5, marginTop: "25px" }}
                >
                  <Text weight={700}>Nasi Campur Mak Odeng</Text>
                  <Badge color="brand" variant="light">
                    Tersedia
                  </Badge>
                </Group>
                <br />
                <Text size="sm" style={{ lineHeight: 1.5 }}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos
                  labore voluptate aut nesciunt inventore rerum eveniet incidunt
                  eaque perspiciatis. Aliquam deserunt similique sed doloribus
                  sapiente nulla? Corrupti cum iste iure?
                </Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  style={{ marginTop: 14 }}
                >
                  Pesan Sekarang
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </AtomsContainer>
      <br />
      <br />

      <footer className={classes.footer}>
        <AtomsContainer>
          <Grid direction="column" grow py=".5rem" my="0">
            <Grid.Col span={$isMobile ? 12 : "auto"}>
              <Flex
                gap="xs"
                justify={$isMobile ? "center" : "flex-start"}
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Image width={150} fit="contain" src="/logo.png" />
              </Flex>
            </Grid.Col>
            <Grid.Col span={$isMobile ? 12 : "auto"}>
              <Flex
                gap="xs"
                justify={$isMobile ? "center" : "flex-end"}
                align="center"
                style={{ height: "100%" }}
              >
                <Text color="white">Copyright @ 2023</Text>
              </Flex>
            </Grid.Col>
          </Grid>
        </AtomsContainer>
      </footer>
    </>
  );
};

export default Home;
