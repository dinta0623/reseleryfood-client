import { useState } from "react";
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
import { IconTypography } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const NotMatch = () => {
  const navigate = useNavigate();
  return (
    <>
      <Flex align="center" justify="center" gap={0} mih="100vh">
        <div>
          <Image
            maw={350}
            mx="auto"
            radius="md"
            src="/media/404.svg"
            alt="Not Found"
          />
          <Title order={1} align="center">
            Tidak Ditemukan!
          </Title>
          <Text align="center">Halaman yang Anda maksud tidak ditemukan!</Text>
          <Group position="center">
            <Button
              variant="subtle"
              mt="md"
              compact
              onClick={() => navigate("/")}
            >
              Kembali
            </Button>
          </Group>
        </div>
      </Flex>
    </>
  );
};

export default NotMatch;
