import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackgroundImage,
  Title,
  Text,
  Overlay,
  AspectRatio,
  Image,
  Flex,
  createStyles,
  Grid,
  Button,
  Badge,
  Group,
  Card,
  SimpleGrid,
  Burger,
  rem,
} from "@mantine/core";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "../Components/Organism/Navbar";

const mockdata = [
  {
    title: "Pesan Menu Yang Anda Inginkan",
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
                    rem fugiat explicabo beatae, obcaecati maiores quae quis
                    soluta voluptatibus numquam odit nulla minus dolor ipsam
                    maxime, dolorem aperiam unde esse?`,
  },
  {
    title: "Gabung Bersama Kami Menjadi Mitra",
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
            rem fugiat explicabo beatae, obcaecati maiores quae quis
            soluta voluptatibus numquam odit nulla minus dolor ipsam
            maxime, dolorem aperiam unde esse?`,
  },
];

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
    },
  },
}));

const Home = (props) => {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const { classes } = useStyles();

  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      {/* <feature.icon /> */}
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
      <br />
      <Button
        onClick={() => $navigate("/rekomendasi")}
        fullWidth={$isMobile ? true : false}
        compact
        variant="subtle"
        rightIcon={<i className="ri-arrow-right-line"></i>}
      >
        Lebih Lanjut
      </Button>
    </Card>
  ));

  // useEffect(() => {
  //   (async function test() {
  //     console.log("test");
  //     console.log(await useStorage("credentials"));
  //   })();
  // }, []);

  return (
    <>
      <div className="dotted">
        <br />
        <AtomsContainer>
          <AspectRatio ratio={$isMobile ? 1 : 16 / 6}>
            <BackgroundImage
              src="/hero.jpg"
              radius="md"
              h="500px"
              color="black"
            >
              <Overlay color="brand" opacity={0.5}>
                <Flex
                  gap={0}
                  direction="column"
                  justify="center"
                  align="center"
                  h="100%"
                  px="2rem"
                >
                  <Title order={1} size="h1" color="white">
                    Bingung Cari Makan atau Reservasi?
                  </Title>
                  <br />
                  <Text color="#fff" size="lg">
                    Pesan sekarang disini, melalui kami. Pengiriman cepat,
                    reservasi aman dan jumlah resto yang tak terhitung untuk
                    dicoba
                  </Text>
                  <br />
                  <Button
                    onClick={() => $navigate("/rekomendasi")}
                    fullWidth={$isMobile ? true : false}
                    rightIcon={<i className="ri-arrow-right-line"></i>}
                  >
                    Pesan Sekarang
                  </Button>
                </Flex>
              </Overlay>
            </BackgroundImage>
          </AspectRatio>
        </AtomsContainer>
        <br />
      </div>

      <br />
      <br />

      <AtomsContainer>
        <Group position="center">
          <Badge variant="filled" size="lg">
            Efisien dan cepat
          </Badge>
        </Group>

        <Title order={2} className={classes.title} ta="center" mt="sm">
          Dengan sekali klik, pesananmu akan langsung diproses
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad rem fugiat
          explicabo beatae, obcaecati maiores quae quis soluta voluptatibus
          numquam odit nulla minus dolor ipsam maxime, dolorem aperiam unde
          esse?
        </Text>

        <SimpleGrid
          cols={2}
          mt={50}
          breakpoints={[{ maxWidth: "md", cols: 1 }]}
        >
          {features}
        </SimpleGrid>
      </AtomsContainer>
    </>
  );
};

export default Home;
