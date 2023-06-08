import { useNavigate } from "react-router-dom";
import { Text, Image, Flex, createStyles, Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AtomsContainer } from "@/Components/Atoms";

const useStyles = createStyles((theme) => ({
  navbar: {
    background: "white",
    borderBottom: ".05rem",
    borderBottomColor: theme.colors.gray[2],
    borderBottomStyle: "solid",
  },
  footer: {
    padding: "2rem 0",
    background: theme.colors.brand[5],
    borderTop: ".05rem",
    borderTopColor: theme.colors.gray[2],
    borderTopStyle: "solid",
  },
}));

export default function Footer({ children }) {
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const { classes } = useStyles();
  return (
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
  );
}
