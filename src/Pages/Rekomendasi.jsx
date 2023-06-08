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
  Skeleton,
  AspectRatio,
  Title,
} from "@mantine/core";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import { useApi } from "@/utility/api";

export default function Rekomendasi(props) {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [menu, setMenu] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        const $resp = await useApi.get(`/menu`);
        setMenu($resp.result);
        console.log($resp.result);
      } finally {
        setMainLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="dotted">
        <AtomsContainer>
          <AspectRatio ratio={$isMobile ? 1 : 16 / 6}>
            <Flex
              gap={0}
              direction="column"
              justify="center"
              align="center"
              h="100%"
              px="2rem"
            >
              <Title order={1} size="h1">
                Rekomendasi Menu dan Resto
              </Title>
              <br />
              <Text size="lg">
                Pesan sekarang disini, melalui kami. Pengiriman cepat, reservasi
                aman dan jumlah resto yang tak terhitung untuk dicoba
              </Text>
              <br />
            </Flex>
          </AspectRatio>
        </AtomsContainer>
      </div>

      <AtomsContainer>
        <Grid direction="column" py=".5rem" my="0" gutter="xl" justify="center">
          {!mainLoading || menu ? (
            menu?.map((item, idx) => (
              <Grid.Col key={idx} span={$isMobile ? 12 : 4}>
                <Card
                  shadow="sm"
                  p="lg"
                  h="100%"
                  style={{ overflow: "hidden" }}
                >
                  <Card.Section
                    component="a"
                    // href="https://mantine.dev"
                    // target="_blank"
                  >
                    <Image
                      src={
                        item.picture ||
                        "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/5474d317-d794-4ef3-b370-5de2a5fd3f55_Go-Biz_20221226_150811.jpeg?auto=format"
                      }
                      height={160}
                      alt="Norway"
                    />
                  </Card.Section>
                  <Group
                    position="apart"
                    style={{ marginBottom: 5, marginTop: "25px" }}
                  >
                    <Text weight={700}>{item.name}</Text>
                    <Badge color="brand" variant="light">
                      {item.stok > 0 ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </Group>
                  <br />
                  <Text size="sm" style={{ lineHeight: 1.5 }}>
                    {item.desc}
                  </Text>
                </Card>
              </Grid.Col>
            ))
          ) : (
            <>
              <Skeleton visible>
                Lorem ipsum dolor sit amet...
                {/* other content */}
              </Skeleton>
            </>
          )}
        </Grid>
      </AtomsContainer>
    </>
  );
}
