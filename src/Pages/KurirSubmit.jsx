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
  MultiSelect,
  FileInput,
  TextInput,
} from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useForm } from "@mantine/form";
import { useSelector, useDispatch } from "react-redux";
import blobToBase64 from "@/utility/blobToBase64";

export default function Profil() {
  const $params = useParams();
  const $dispatch = useDispatch();
  const $user = useSelector((state) => state.user);
  const $mitra = useSelector((state) => state.mitra);
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
    try {
      nprogress.start();
      console.log({
        ...payload,
        mitra_id: $mitra.id,
        roles: ["kurir"],
      });
      if ($form.isValid()) {
        const resp = await useApi.post("/users", {
          ...payload,
          mitra_id: $mitra.id,
          roles: ["kurir"],
        });
        setUsers((state) => ({ ...state, ...resp.result }));
        showNotification({
          title: "Berhasil",
          message: "Berhasil menambahkan kurir Anda",
          top: true,
        });
        $form.reset();
      }
    } catch (error) {
      console.log(error);
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
  return (
    <>
      <AtomsContainer>
        <br />
        <Flex justify="space-between" align="center">
          <div>
            <Title order={2}>Tambah Kurir</Title>
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
              src={image?.url || users?.avatar}
              alt="Random image"
              withPlaceholder
            />
            <br />
            <FileInput
              placeholder={"Klik Untuk Ganti Avatar"}
              onChange={$onUploadAvatar}
              accept="image/png,image/jpg,image/jpeg"
              withAsterisk
            />
            {/* <Button fullWidth>Ganti Avatar</Button> */}
          </Grid.Col>
          <Grid.Col span={$isMobile ? 12 : "auto"}>
            <form onSubmit={$form.onSubmit($onSubmit)}>
              <TextInput
                label="Nama Lengkap"
                type="text"
                placeholder={"Tulis nama"}
                {...$form.getInputProps("name")}
              />
              <TextInput
                mt="md"
                label="Email Anda"
                type="email"
                placeholder={"Tulis email"}
                {...$form.getInputProps("email")}
              />
              <TextInput
                mt="md"
                type="password"
                placeholder="Minimal 8 karakter"
                label="Kata Sandi"
                {...$form.getInputProps("password")}
              />

              <Button type="submit" mt="xl" fullWidth>
                Simpan
              </Button>
            </form>
          </Grid.Col>
        </Grid>
      </AtomsContainer>
    </>
  );
}
