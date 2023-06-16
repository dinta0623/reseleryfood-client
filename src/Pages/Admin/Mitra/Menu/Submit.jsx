import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/utility/api";

import {
  Text,
  Image,
  Title,
  Flex,
  Grid,
  Button,
  Select,
  Textarea,
  FileInput,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useForm } from "@mantine/form";
import blobToBase64 from "@/utility/blobToBase64";
import { useSelector, useDispatch } from "react-redux";

export default function Profil() {
  const $params = useParams();
  const $dispatch = useDispatch();
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const [menu, setMenu] = useState(null);
  const [dataMitra, setDataMitra] = useState(null);
  const [dataCategory, setDataCategory] = useState(null);
  const [users, setUsers] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);

  const $initialValues = {
    mitra_id: "",
    name: "",
    qty: 0,
    price: 0,
    // status: "",
    desc: "",
    category: "",
  };
  const $form = useForm({
    validateInputOnChange: true,
    initialValues: $initialValues,
    validate: {
      name: (value) =>
        value.length >= 2 ? null : "Nama setidaknya mengandung 2 karakter",
      qty: (value) => (Number(value) > 0 ? null : "Pastikan isi stok benar"),
      price: (value) => (Number(value) > 0 ? null : "Pastikan harga terisi"),
      mitra_id: (value) =>
        value ? null : "Pastikan mitra/resto terpilih satu",
      category: (value) => (value ? null : "Pastikan kategori terisi"),
    },
  });

  const [image, setImage] = useState(null);

  const $onUploadAvatar = async (file) => {
    nprogress.start();
    try {
      if (file && file.size > 3000000) {
        showNotification({
          title: "Gagal",
          message: "Pastikan ukuran gambar tidak lebih dari 3Mb",
          top: true,
          autoClose: 2000,
          color: "red",
        });
        return;
      }

      setImage({
        url: await blobToBase64(new Blob([file], { type: file.type })),
        name: file.name,
      });
    } catch (error) {
      showNotification({
        title: "Gagal",
        message: "Terdapat kesalahan ketika mengupload gambar",
        top: true,
        autoClose: 2000,
        color: "red",
      });
    }

    nprogress.complete();
  };

  const $onSubmit = async (payload) => {
    try {
      nprogress.start();
      if ($form.isValid()) {
        const body = {
          ...payload,
          category: payload?.category?.trim()?.toLowerCase(),
          picture: image?.url,
        };
        // console.log({ id: $params.id, ...body });
        if ($params.id) {
          await useApi
            .put("/menu", { id: $params.id, ...body })
            .then((resp) => setMenu(resp.result));
        } else {
          await useApi.post("/menu", body);
        }
        $navigate(-1);
        showNotification({
          title: "Berhasil",
          message: "Berhasil menyimpan data menu",
          top: true,
        });
        $form.reset();
      }
    } catch (error) {
      console.log(error);
      showNotification({
        title: "Gagal",
        message: "Terdapat kesalahan ketika menyimpan menu",
        top: true,
        autoClose: 2000,
        color: "red",
      });
      $form.isValid();
    } finally {
      nprogress.complete();
    }
  };

  const $onSearchMitra = async (payload) => {
    nprogress.start();
    const search = payload.currentTarget.value;

    const resp = await useApi.get("/mitra", {
      ...(search
        ? {
            params: {
              name: `'%${search}%'`,
            },
          }
        : {}),
    });

    if (resp?.result?.length > 0) {
      setDataMitra(
        resp.result.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      );
    }

    nprogress.complete();
  };

  const $onSearchCategory = async (payload) => {
    nprogress.start();
    const search = payload.currentTarget.value;
    const $query =
      "SELECT menu.category, COUNT(*) as total FROM `menu` GROUP BY category ORDER BY total DESC";

    const resp = await useApi.get(`/menu/q/${encodeURIComponent($query)}`);

    if (resp?.result?.length > 0) {
      setDataCategory(resp.result.map((item) => item.category));
    }

    nprogress.complete();
  };

  useEffect(() => {
    if ($params.id) {
      (async function fetchData() {
        try {
          nprogress.start();
          const $resp = await useApi.get(`/menu/${$params.id}`);
          setMenu($resp.result);
          if ($resp?.result?.qty) {
            $form.setFieldValue("qty", $resp.result.qty);
          }
          if ($resp?.result?.price) {
            $form.setFieldValue("price", $resp.result.price);
          }
        } finally {
          setTimeout(() => nprogress.complete(), 2000);
        }
        //
      })();
    }
  }, []);

  return (
    <>
      <AtomsContainer>
        <br />
        <Flex justify="space-between" align="center">
          <div>
            <Title order={2}>
              {$params.id ? "Perbarui Menu" : "Tambah Menu"}
            </Title>
            {/* <Text>alif@hayokerja.com</Text> */}
          </div>
          <Button onClick={() => $navigate("/admin")}>Kembali</Button>
        </Flex>
        <br />
        <Grid direction="column" py=".5rem" my="0" gutter="xl" justify="center">
          <Grid.Col span={$isMobile ? 12 : 3}>
            <Image
              width="100%"
              height={250}
              style={{
                borderRadius: "50%",
              }}
              src={image?.url || menu?.picture}
              alt="Random image"
              withPlaceholder
            />
            <br />
            <FileInput
              placeholder={image?.name || "Klik Untuk Ganti Foto Menu"}
              onChange={$onUploadAvatar}
              accept="image/png,image/jpg,image/jpeg"
              withAsterisk
            />
            {/* <Button fullWidth>Ganti Avatar</Button> */}
          </Grid.Col>
          <Grid.Col span={$isMobile ? 12 : "auto"}>
            <form onSubmit={$form.onSubmit($onSubmit)}>
              {/* <TextInput
                label="Mitra/Resotran"
                type="text"
                placeholder={users?.name || "Tentukan Mitra/Restoran"}
                {...$form.getInputProps("name")}
                rightSection={
                  <ActionIcon onClick={() => $navigate("/")}>
                    <i className="ri-add-circle-line ri-xl"></i>
                  </ActionIcon>
                }
              /> */}
              <Select
                withAsterisk
                data={dataMitra || []}
                label="Pilih Mitra"
                searchable
                clearable
                placeholder={
                  menu?.mitra ||
                  "Tentukan satu mitra (Klik Enter untuk mencari)"
                }
                onChange={(payload) => $form.setFieldValue("mitra_id", payload)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    $onSearchMitra(e);
                  }
                }}
                {...$form.getInputProps("mitra_id")}
              />
              <TextInput
                mt="md"
                label="Nama Menu"
                type="text"
                withAsterisk
                placeholder={menu?.name || "Ketik nama menu"}
                {...$form.getInputProps("name")}
              />

              <NumberInput
                mt="md"
                withAsterisk
                label="Stok Menu"
                stepHoldDelay={500}
                stepHoldInterval={100}
                placeholder={menu?.qty || "Tuliskan Stok"}
                {...$form.getInputProps("qty")}
              />
              <NumberInput
                mt="md"
                icon={<Text size="sm">Rp.</Text>}
                label="Harga Menu"
                stepHoldDelay={500}
                stepHoldInterval={100}
                placeholder={menu?.price || "Tuliskan Harga"}
                {...$form.getInputProps("price")}
              />
              <Textarea
                mt="md"
                placeholder={menu?.desc || "Keterangan dari menu"}
                label="Keterangan"
                {...$form.getInputProps("desc")}
              />
              <Select
                mt="md"
                data={dataCategory || []}
                label="Pilih atau Tambah Kategori"
                searchable
                clearable
                placeholder={
                  menu?.category ||
                  "Tentukan kategori (Klik Enter untuk mencari)"
                }
                onChange={(payload) => $form.setFieldValue("category", payload)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    $onSearchCategory(e);
                  }
                }}
                creatable
                getCreateLabel={(query) => `+ Tambah Kategori ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  setDataCategory((current) => [...current, query]);
                  return item;
                }}
                {...$form.getInputProps("category")}
              />
              {/* <TextInput
                mt="md"
                type="password"
                placeholder="Minimal 8 karakter"
                label="Kata Sandi"
                {...$form.getInputProps("password")}
              /> */}
              {/* <Select
                mt="md"
                data={[
                  { value: "tersedia", label: "Tersedia" },
                  { value: "habis", label: "Habis" },
                  { value: "habis", label: "Habis" },
                ]}
                label="Status Menu"
                placeholder="Tentukan Status"
              /> */}
              <Button type="submit" mt="xl" fullWidth>
                Simpan Menu
              </Button>
            </form>
          </Grid.Col>
        </Grid>
      </AtomsContainer>
    </>
  );
}
