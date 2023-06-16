import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Image,
  Flex,
  NumberInput,
  Grid,
  Rating,
  Badge,
  Group,
  Card,
  Skeleton,
  AspectRatio,
  Title,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";
import Navbar from "@/Components/Organism/Navbar";
import { useApi } from "@/utility/api";

const CategorySection = lazy(() => import("./Category"));
const RestoSection = lazy(() => import("./Resto"));
const MenuSection = lazy(() => import("./Menu"));

export default function Rekomendasi(props) {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const [menu, setMenu] = useState(null);
  const [category, setCategory] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      try {
        setMainLoading(true);
        const $resp = await useApi.get(`/menu`);
        if ($resp?.resukt) setMenu($resp.result);
        // console.log($resp.result);
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
        <AtomsContainer>
          <Suspense fallback={<p>load categories...</p>}>
            <CategorySection />
          </Suspense>
        </AtomsContainer>
        <br />
        <br />
      </div>

      <br />

      <AtomsContainer>
        <Suspense fallback={<p>load menus...</p>}>
          <MenuSection />
        </Suspense>
      </AtomsContainer>

      <br />
      <AtomsContainer>
        <Suspense fallback={<p>load restos...</p>}>
          <RestoSection />
        </Suspense>
      </AtomsContainer>
    </>
  );
}
