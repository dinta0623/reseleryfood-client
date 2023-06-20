import { Grid } from "@mantine/core";
import { Group, Accordion } from "@mantine/core";
import {
  AppShell,
  Navbar,
  Header,
  createStyles,
  Footer,
  Flex,
  Image,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { BackgroundImage, Overlay, Center, Box } from "@mantine/core";
import { AtomsContainer } from "@/Components/Atoms";
import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  footer: {
    padding: "2rem 2rem",
    background: theme.colors.brand[5],
    borderTop: ".05rem",
    borderTopColor: theme.colors.gray[2],
    borderTopStyle: "solid",
  },
}));

export default function AppShellDemo() {
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const { classes } = useStyles();

  // const $isMobile = useMediaQuery("(max-width: 80em)");
  return (
    <AppShell padding={0}>
      <Text
        align="center"
        h={200}
        size={50}
        mt={50}
        mx="auto"
        ff={"Jakarta Plus"}
      >
        Reservation and Delivery Food
      </Text>
      <Grid ta={"center"} justify="center" mb={50} ff={"Jakarta Plus"}>
        <Grid.Col bg={"black"} span={3} mr={30}>
          <Text c={"white"}>Teknologi</Text>
        </Grid.Col>
        <Grid.Col bg={"black"} c={"black"} span={3} mr={30}>
          <Text c={"white"}>Inovasi</Text>
        </Grid.Col>
        <Grid.Col bg={"black"} c={"black"} span={3} mr={30}>
          <Text c={"white"}>Kemudahan Akses</Text>
        </Grid.Col>
      </Grid>
      <Grid ta={"left"} justify="center" ff={"Jakarta Plus"}>
        <Grid.Col bg={"#D9D9D9"} c={"black"} span={3} mr={30}>
          ReseleryFood adalah layanan makanan pesan antar dan reservasi yang
          revolusioner, yang menawarkan pengalaman pelanggan yang luar biasa
          melalui penggunaan teknologi canggih. Dengan menggunakan platform
          inovatif kami, pelanggan dapat dengan mudah memesan makanan favorit
          mereka dari berbagai restoran terkemuka, serta melakukan reservasi di
          tempat-tempat yang mereka inginkan.
        </Grid.Col>
        <Grid.Col bg={"#D9D9D9"} c={"black"} span={3} mr={30}>
          Visi kami yang kuat melibatkan komitmen yang tak henti-hentinya untuk
          berinovasi dan mengembangkan layanan kami guna memenuhi kebutuhan
          pelanggan. Kami menyadari bahwa preferensi dan harapan pelanggan terus
          berkembang seiring waktu, oleh karena itu, kami selalu berusaha untuk
          menjadi yang terdepan dalam menghadirkan solusi yang relevan dan
          memuaskan.
        </Grid.Col>
        <Grid.Col bg={"#D9D9D9"} c={"black"} span={3} mr={30}>
          ReseleryFood bertujuan untuk memberikan akses yang mudah dan cepat
          bagi pelanggan untuk memesan makanan favorit mereka atau melakukan
          reservasi dengan cepat dan tanpa hambatan. Dengan menggunakan
          teknologi canggih, kami menciptakan platform yang intuitif dan
          user-friendly, yang memungkinkan pelanggan untuk dengan mudah
          menjelajahi pilihan menu, menyesuaikan pesanan mereka, dan melakukan
          pembayaran secara online dengan cepat.
        </Grid.Col>
      </Grid>

      <Box my={100}>
        <BackgroundImage
          src="https://i.pinimg.com/564x/60/11/20/60112018573a25fc933638ee1891efa4.jpg"
          radius="md"
          my={50}
          py={100}
        >
          <Center p="md">
            <Text
              color="#fff"
              p={"md"}
              mx={100}
              size={25}
              weight={"bold"}
              ta={"center"}
            >
              100.000+
              <br />
              Kostumer
            </Text>
            <Text
              color="#fff"
              p={"md"}
              mx={100}
              size={25}
              weight={"bold"}
              ta={"center"}
            >
              5.450
              <br />
              Karyawan
            </Text>
            <Text
              color="#fff"
              p={"md"}
              mx={100}
              size={25}
              weight={"bold"}
              ta={"center"}
            >
              500.000+
              <br />
              Pesanan
            </Text>
          </Center>
        </BackgroundImage>
      </Box>

      <Text mb={30} ta={"center"} ff={"Jakarta Plus"} size={50} weight={"bold"}>
        Tersedia di Tiga Negara
      </Text>
      <Box>
        <Grid ta={"center"} justify="center" ff={"Jakarta Plus"}>
          <Grid.Col c={"black"} span={3} mr={20}>
            <Image
              radius={"md"}
              src={
                "https://i.pinimg.com/564x/a2/05/77/a20577471682cc7eb755168b0a74a4bc.jpg"
              }
            />
          </Grid.Col>
          <Grid.Col c={"black"} span={3} mr={20}>
            <Image
              radius={"md"}
              src={
                "https://i.pinimg.com/564x/7c/d8/c9/7cd8c9bf6a4fa47bf3987f01d3932005.jpg"
              }
            />
          </Grid.Col>
          <Grid.Col c={"black"} span={3} mr={20}>
            <Image
              radius={"md"}
              src={
                "https://i.pinimg.com/564x/96/0f/1c/960f1cc2ce7eb460e3a6c7914a8bc215.jpg"
              }
            />
          </Grid.Col>
        </Grid>
        <Grid ta={"center"} justify="center" mb={50} ff={"Jakarta Plus"}>
          <Grid.Col c={"black"} span={3} mr={20}>
            <Text ff={"Times New Roman"} weight={"bold"}>
              Indonesia
            </Text>
          </Grid.Col>
          <Grid.Col c={"black"} span={3} mr={20}>
            <Text ff={"Times New Roman"} weight={"bold"}>
              Malaysia
            </Text>
          </Grid.Col>
          <Grid.Col c={"black"} span={3} mr={20}>
            <Text ff={"Times New Roman"} weight={"bold"}>
              Singapore
            </Text>
          </Grid.Col>
        </Grid>
      </Box>

      <Box bg={"#163300"}>
        <Text
          ff={"Jakarta Plus"}
          c={"#9fe870"}
          ta={"center"}
          pt={50}
          size={40}
          weight={"bold"}
        >
          Misi Kami
        </Text>
        <Text c={"#9fe870"} ta={"center"} py={50} px={200}>
          Misi dari platform pemesanan dan reservasi tempat makan kami adalah
          memberikan pengalaman yang mudah, praktis, dan memuaskan bagi para
          pengguna kami dalam menemukan, memesan, dan mereservasi tempat makan
          yang sesuai dengan preferensi mereka. Kami berkomitmen untuk
          menghubungkan pelanggan dengan berbagai pilihan restoran yang
          berkualitas, sehingga mereka dapat menikmati makanan yang lezat dan
          pengalaman kuliner yang tak terlupakan.
        </Text>
      </Box>

      <Accordion defaultValue="customization" mx={100} my={100}>
        <Accordion.Item value="customization">
          <Accordion.Control>Visi Pertumbuhan Global</Accordion.Control>
          <Accordion.Panel>
            Lokasi internasional dan franchisee kami memainkan peran yang sangat
            penting dalam mewujudkan visi Deliciously Different® kami serta
            menciptakan nilai jangka panjang bagi para pemegang saham kami.
            Dengan menghadirkan konsep yang unik dan menggugah selera, kami
            berupaya menjangkau lebih banyak konsumen di seluruh dunia. Melalui
            kerjasama dengan mitra franchisee yang berkomitmen, kami dapat
            menawarkan pengalaman kuliner yang luar biasa di berbagai lokasi,
            memperluas jangkauan merek kami, dan memperkuat citra Deliciously
            Different®. Dengan menjaga standar kualitas yang tinggi dan fokus
            pada inovasi, kami berharap dapat terus tumbuh dan menjadi pemimpin
            di industri makanan global, memberikan kepuasan tak tertandingi
            kepada pelanggan kami, dan menghasilkan keuntungan yang signifikan
            bagi pemegang saham kami.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="flexibility">
          <Accordion.Control>Mitra Internasional</Accordion.Control>
          <Accordion.Panel>
            Kami terus aktif dalam mencari mitra baru di luar negeri untuk
            mengakselerasi pertumbuhan internasional kami. Pertumbuhan di pasar
            global selalu menjadi fokus utama kami, dan sebagai mitra
            reseleryfood, Anda akan mendapatkan berbagai keuntungan yang
            signifikan. Dengan bergabung dengan kami, Anda akan memiliki akses
            ke merek yang terkenal dan teruji, serta portofolio produk yang
            beragam dan inovatif. Kami menyediakan dukungan yang komprehensif,
            mulai dari pelatihan dan bimbingan hingga materi pemasaran yang
            terpercaya, untuk membantu Anda berhasil dalam mengoperasikan bisnis
            Anda. Selain itu, sebagai mitra kami, Anda akan menjadi bagian dari
            jaringan yang kuat dan berkembang, dengan kesempatan untuk
            berkolaborasi dan berbagi pengetahuan dengan mitra-mitra lain di
            seluruh dunia. Bergabunglah dengan kami sebagai mitra reseleryfood,
            dan bersama-sama kita dapat mencapai kesuksesan yang luar biasa di
            pasar internasional.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="focus-ring">
          <Accordion.Control>Bergabung dengan kami</Accordion.Control>
          <Accordion.Panel>
            Bergabunglah dengan kami dan menjadi bagian dari tim luar biasa kami
            yang bertekad untuk menjadikan perusahaan kami sebagai penyedia
            layanan kepercayaan masyarakat. Di perusahaan kami, kita memahami
            bahwa apa yang kita lakukan memiliki dampak yang nyata dan positif.
            Setiap anggota tim kami berperan dalam menciptakan perbedaan yang
            signifikan dalam kehidupan orang lain. Dari inovasi produk hingga
            pengalaman pelanggan yang luar biasa, setiap langkah yang kita ambil
            memiliki tujuan akhir untuk memberikan layanan yang melebihi
            harapan. Kami mencari individu-individu yang bersemangat, berbakat,
            dan memiliki keahlian unik untuk bergabung dengan kami dalam
            mengubah cara dunia melihat dan mempercayai perusahaan kami.
            Bersama-sama, kita dapat melampaui batasan dan mencapai prestasi
            yang luar biasa, sambil meninggalkan jejak yang positif di
            masyarakat. Bergabunglah dengan kami dan mari kita menjadi agen
            perubahan yang membuat perbedaan yang berarti dalam dunia ini.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

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
    </AppShell>
  );
}
