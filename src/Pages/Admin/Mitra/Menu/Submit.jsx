import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/utility/api";

import {
  Tabs,
  Text,
  Image,
  Title,
  Flex,
  createStyles,
  ActionIcon,
  Grid,
  Button,
  Badge,
  MultiSelect,
  Card,
  SimpleGrid,
  FileInput,
  TextInput,
} from "@mantine/core";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useForm } from "@mantine/form";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "@/Components/Organism/Navbar";
import { SET_USER } from "@/store/UserSlice";

export default function Profil() {
  const $params = useParams();
  const $dispatch = useDispatch();
  const $user = useSelector((state) => state.user);
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

  const [users, setUsers] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);

  const $initialValues = {
    name: "",
    email: "",
    password: "",
  };
  const $form = useForm({
    validateInputOnChange: true,
    initialValues: $initialValues,
    validate: {
      name: (value) =>
        value.length >= 2 ? null : "Nama setidaknya mengandung 2 karakter",
      email: (value) =>
        !value || /^\S+@\S+$/.test(value)
          ? null
          : "Email yang Anda masukkan tidak valid",
      password: (value) =>
        value && value.length < 8
          ? "Password setidaknya terdiri dari 8 karakter"
          : null,
    },
  });

  const [image, setImage] = useState(null);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const $onUploadAvatar = async (file) => {
    nprogress.start();
    try {
      if (file && file.size > 3000000) {
        showNotification({
          title: "Gagal",
          message: "Pastikan ukuran avatar tidak lebih dari 3Mb",
          top: true,
          autoClose: 2000,
          color: "red",
        });
        return;
      }

      setImage({
        url: URL.createObjectURL(file),
        name: file.name,
      });
      URL.revokeObjectURL(file);
      // console.log(URL.createObjectURL(file));
      //   console.log(await blobToBase64(file));
      //   console.log(await blobToBase64(new Blob([file], { type: file.type })));
      const resp = await useApi.put("/users", {
        id: users.id,
        avatar: await blobToBase64(new Blob([file], { type: file.type })),
      });
      setUsers((state) => ({ ...state, ...resp.result }));
      showNotification({
        title: "Berhasil",
        message: "Berhasil memperbarui avatar Anda",
        top: true,
      });
    } catch (error) {
      showNotification({
        title: "Gagal",
        message: "Terdapat kesalahan ketika memperbarui avatar",
        top: true,
        autoClose: 2000,
        color: "red",
      });
    }

    nprogress.complete();
  };

  const $onSubmit = async (payload) => {
    if (!payload?.password) {
      delete payload?.password;
    }
    if (!payload?.email) {
      delete payload?.email;
    }
    try {
      nprogress.start();
      if ($form.isValid()) {
        const resp = await useApi.put("/users", {
          id: users.id,
          ...payload,
        });
        setUsers((state) => ({ ...state, ...resp.result }));
        showNotification({
          title: "Berhasil",
          message: "Berhasil memperbarui data Anda",
          top: true,
        });
        $form.reset();
      }
    } catch (error) {
      // console.log(error);
      showNotification({
        title: "Gagal",
        message: "Terdapat kesalahan ketika memperbarui biodata",
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
    // if (!$params?.id) {
    //   showNotification({
    //     title: "Gagal",
    //     message: "Terdapat kesalahan ketika memuat pengguna yang akan diedit",
    //     top: true,
    //     autoClose: 2000,
    //     color: "red",
    //   });
    //   $navigate("/admin");
    // }
    // (async function fetchData() {
    //   try {
    //     setMainLoading(true);
    //     const $resp = await useApi.get(`/users/${$params.id}`);
    //     setUsers($resp.result);
    //   } finally {
    //     setTimeout(() => setMainLoading(false), 2000);
    //   }
    //   //
    // })();
  }, []);

  return (
    <>
      <AtomsContainer>
        <br />
        <Flex justify="space-between" align="center">
          <div>
            <Title order={2}>Tambah Menu</Title>
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
              src={image?.url || users?.avatar}
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
              <TextInput
                label="Mitra/Resotran"
                type="text"
                placeholder={users?.name || "Tentukan Mitra/Restoran"}
                {...$form.getInputProps("name")}
                rightSection={
                  <ActionIcon onClick={() => $navigate("/")}>
                    <i className="ri-add-circle-line ri-xl"></i>
                  </ActionIcon>
                }
              />
              <TextInput
                mt="md"
                label="Nama Menu"
                type="text"
                placeholder={users?.name || "Tuliskan Nama"}
                {...$form.getInputProps("name")}
              />

              <TextInput
                mt="md"
                label="Stok Menu"
                type="number"
                placeholder={users?.name || "Tuliskan Stok"}
                {...$form.getInputProps("name")}
              />
              <TextInput
                mt="md"
                label="Harga Menu"
                type="number"
                placeholder={users?.name || "Tuliskan Harga"}
                {...$form.getInputProps("name")}
              />
              {/* <TextInput
                mt="md"
                type="password"
                placeholder="Minimal 8 karakter"
                label="Kata Sandi"
                {...$form.getInputProps("password")}
              /> */}
              <MultiSelect
                mt="md"
                data={[
                  { value: "admin", label: "Admin" },
                  { value: "mitra", label: "Mitra" },
                ]}
                label="Status Menu"
                placeholder="Tentukan Status"
              />
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
