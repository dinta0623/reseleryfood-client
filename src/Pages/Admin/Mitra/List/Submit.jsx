import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/utility/api";
import AddMarker from "@/Components/Molecules/AddMarker";

import {
  Tabs,
  Text,
  Image,
  Title,
  Flex,
  ActionIcon,
  Grid,
  Button,
  Select,
  FileInput,
  TextInput,
} from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useForm } from "@mantine/form";
import blobToBase64 from "@/utility/blobToBase64";
import { useSelector, useDispatch } from "react-redux";

export default function Profil() {
  const $params = useParams();
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const [mitra, setMitra] = useState(null);
  const [dataPIC, setDataPIC] = useState(null);
  const [address, setAddress] = useState(null);
  const [isMapMarker, { open: setMapMarkerOpen, close: setMapMarkerClose }] =
    useDisclosure(false);

  const $initialValues = {
    name: "",
    address: "",
    phone: "",
    pic: null,
    // lat: "",
    // lng: "",
  };
  const $form = useForm({
    validateInputOnChange: true,
    initialValues: $initialValues,
    validate: {
      name: (value) =>
        value.length >= 2 ? null : "Nama setidaknya mengandung 2 karakter",
      address: (value) => (value ? null : "Kolom wajib diisi"),
      phone: (value) => (value ? null : "Kolom wajib diisi"),
      pic: (value) => (value ? null : "Wajib memiliki pic"),
    },
  });

  const [image, setImage] = useState(null);

  const $onSearchUsers = async (payload) => {
    nprogress.start();
    const search = payload.currentTarget.value;

    let $query =
      "SELECT * from users WHERE roles NOT LIKE '%admin%' AND roles NOT LIKE '%mitra%' AND roles NOT LIKE '%kurir%' ";

    if (search) {
      $query += `AND users.name LIKE '%${search}%' `;
    }

    const resp = await useApi.get(`/users/q/${encodeURIComponent($query)}`);
    // console.log("hasilnya", resp?.result);

    if (resp?.result?.length > 0) {
      if (mitra)
        resp.result.push({
          id: mitra.user_id,
          name: mitra.pic,
        });
      setDataPIC(
        resp.result.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      );
    }

    nprogress.complete();
  };

  const $onUpdatedAddresss = (result) => {
    setAddress(result);
    $form.setFieldValue("address", result.payload.display_name);
  };

  const $onUploadLogo = async (file) => {
    nprogress.start();
    try {
      if (file && file.size > 3000000) {
        showNotification({
          title: "Gagal",
          message: "Pastikan ukuran logo tidak lebih dari 3Mb",
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
        message: "Terdapat kesalahan ketika mengunggah logo",
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
      if ($form.isValid() && address?.pos?.length > 0) {
        const body = {
          ...payload,
          user_id: payload.pic,
          lat: address.pos[0],
          lng: address.pos[1],
          logo: image?.url,
        };
        if ($params.id) {
          const last_user_id = mitra.user_id;
          if (last_user_id != body.user_id) {
            // need to change last_user id into 'customer'
            await useApi.put("/users", {
              id: last_user_id,
              roles: ["customer"],
            });
          }
          await useApi
            .put("/mitra", { id: $params.id, ...body })
            .then((resp) => setMitra(resp.result));
        } else {
          await useApi.post("/mitra", body);
        }

        showNotification({
          title: "Berhasil",
          message: "Berhasil menyimpan data Mitra",
          top: true,
        });
        $form.reset();
      }
    } catch (error) {
      // console.log(error);
      showNotification({
        title: "Gagal",
        message: "Terdapat kesalahan ketika menyimpan data",
        top: true,
        autoClose: 2000,
        color: "red",
      });
      $form.isValid();
    } finally {
      nprogress.complete();
    }
  };

  useEffect(() => {
    if ($params.id) {
      (async function fetchData() {
        try {
          nprogress.start();
          const $resp = await useApi.get(`/mitra/${$params.id}`);
          setMitra($resp.result);
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
        <AddMarker
          isMapMarker={isMapMarker}
          setMapMarkerClose={setMapMarkerClose}
          setAddress={$onUpdatedAddresss}
        />
        <br />
        <Flex justify="space-between" align="center">
          <div>
            <Title order={2}>
              {mitra ? `Perbarui ${mitra.name}` : "Daftarkan Mitra Resto"}
            </Title>
            {/* <Text>alif@hayokerja.com</Text> */}
          </div>
          <Button onClick={() => $navigate(-1)}>Kembali</Button>
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
              src={image?.url || mitra?.logo}
              alt="Random image"
              withPlaceholder
            />
            <br />
            <FileInput
              placeholder={image?.name || "Klik Untuk Ganti Logo Perusahaan"}
              onChange={$onUploadLogo}
              accept="image/png,image/jpg,image/jpeg"
              withAsterisk
            />
            {/* <Button fullWidth>Ganti Avatar</Button> */}
          </Grid.Col>
          <Grid.Col span={$isMobile ? 12 : "auto"}>
            <form onSubmit={$form.onSubmit($onSubmit)}>
              <TextInput
                label="Nama Restoran"
                type="text"
                placeholder={mitra?.name || "Tuliskan Nama"}
                {...$form.getInputProps("name")}
              />
              <TextInput
                readOnly
                mt="md"
                label="Alamat Restoran"
                type="text"
                placeholder={
                  mitra?.address ||
                  "Pilih alamat terlebih dahulu -> (Klik icon pada kolom ini)"
                }
                {...$form.getInputProps("address")}
                rightSection={
                  <ActionIcon onClick={() => setMapMarkerOpen()}>
                    <i className="ri-map-pin-line ri-xl"></i>
                  </ActionIcon>
                }
              />
              <TextInput
                mt="md"
                label="Nomor Telepon"
                type="text"
                placeholder={mitra?.phone || "Tuliskan Nomor"}
                {...$form.getInputProps("phone")}
              />
              {/* <TextInput
                mt="md"
                type="password"
                placeholder="Minimal 8 karakter"
                label="Kata Sandi"
                {...$form.getInputProps("password")}
              /> */}
              <Select
                mt="md"
                data={dataPIC || []}
                label="Pilih PIC"
                searchable
                clearable
                placeholder={
                  mitra?.pic ||
                  "Tentukan satu PIC mitra (Klik Enter untuk mencari)"
                }
                onChange={(payload) => $form.setFieldValue("pic", payload)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    $onSearchUsers(e);
                  }
                }}
                {...$form.getInputProps("pic")}
              />
              <Button type="submit" mt="xl" fullWidth>
                Simpan Resto
              </Button>
            </form>
          </Grid.Col>
        </Grid>
        {((mitra?.lat && mitra?.lng) ||
          (address?.pos?.[0] && address?.pos?.[1])) && (
          <div>
            <br />
            <Text>
              <strong>Alamat :</strong>{" "}
              {mitra?.address || address?.payload?.display_name}
            </Text>
            <br />
            <iframe
              width="100%"
              height="250"
              src={`https://maps.google.com/maps?q=${
                mitra?.lat || address?.pos?.[0]
              },${mitra?.lng || address?.pos?.[1]}&z=15&output=embed`}
            ></iframe>
            <br />
            <br />
          </div>
        )}
      </AtomsContainer>
    </>
  );
}
