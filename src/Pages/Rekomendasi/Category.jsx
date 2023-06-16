import { useEffect, useState } from "react";
import { useApi } from "@/utility/api";
import { useMediaQuery, useHover } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { AtomsContainer } from "@/Components/Atoms";
import {
  Grid,
  Skeleton,
  Paper,
  Text,
  Flex,
  Title,
  useMantineTheme,
  Card,
} from "@mantine/core";

export default function Category({}) {
  const { hovered, ref } = useHover();
  const $theme = useMantineTheme();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const [state, setState] = useState();

  const fetchCategory = async () => {
    try {
      const $query =
        "SELECT menu.category, COUNT(*) as total FROM `menu` GROUP BY category ORDER BY total DESC LIMIT 4";
      const resp = await useApi.get(`/menu/q/${encodeURIComponent($query)}`);

      console.log(resp);
      setState(resp?.result);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <>
      <div>
        <Title order={2}>#Kategori</Title>
        <Grid justify="space-between" mt="md">
          {state?.length <= 0
            ? Array(5)
                .fill(null)
                .map((it, idx) => (
                  <Grid.Col key={idx} span={Math.floor(12 / 5)}>
                    <Skeleton visible height={150}>
                      Lorem ipsum dolor sit amet...
                    </Skeleton>
                  </Grid.Col>
                ))
            : state
                ?.concat({
                  category: "Lihat Selengkapnya",
                  icon: <i className="ri-arrow-right-line ri-lg"></i>,
                })
                ?.map((it) => {
                  const cl = ["pink", "blue", "yellow", "violet", "cyan"];
                  return {
                    ...it,
                    color: cl[(Math.random() * cl.length) | 0],
                  };
                })
                ?.map((it, idx) => (
                  <Grid.Col
                    key={idx}
                    ref={ref}
                    span={$isMobile ? 12 : Math.floor(12 / (state.length + 1))}
                    style={{ background: "transparent" }}
                  >
                    <Paper
                      shadow={0}
                      p="md"
                      h={$isMobile ? 50 : 150}
                      sx={(theme) => ({
                        background: theme.fn.rgba(
                          theme.colors[it.color][2],
                          0.5
                        ),
                        border: "1px solid",
                        borderColor: theme.colors[it.color][5],
                        cursor: "pointer",
                        transition: "all 200ms ease-in-out",
                        ":hover": {
                          boxShadow: theme.shadows.lg,
                          transform: "translateY(-10px)",
                        },
                      })}
                    >
                      <Flex justify="center" align="center" h="100%" gap={5}>
                        <Title
                          color={$theme.colors[it.color][5]}
                          tt="capitalize"
                          order={4}
                          align="center"
                        >
                          {it.category}
                        </Title>
                        {it.icon && (
                          <Text mt="xs" color={$theme.colors[it.color][5]}>
                            {it.icon}
                          </Text>
                        )}
                      </Flex>
                    </Paper>
                  </Grid.Col>
                ))}
        </Grid>
      </div>
    </>
  );
}
