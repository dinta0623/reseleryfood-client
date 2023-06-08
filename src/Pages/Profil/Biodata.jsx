import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/utility/api";

import {
  Tabs,
  Text,
  Image,
  Grid,
  Button,
  FileInput,
  TextInput,
} from "@mantine/core";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useForm } from "@mantine/form";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER } from "../../store/UserSlice";

export default function Profil() {
  const $dispatch = useDispatch();
  const $user = useSelector((state) => state.user);
  const $navigate = useNavigate();
  const $isMobile = useMediaQuery("(max-width: 80em)");

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

    // transformValues: (values) => ({
    //     slug: `${values.name}-${values.email}`,
    //     ...values,
    // }),
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
    // console.log(
    //   file.type,
    //   new Blob([file], { type: file.type }),
    //   new File([new Blob([file], { type: file.type })], "avatar")
    // );
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
        id: $user.id,
        avatar: await blobToBase64(new Blob([file], { type: file.type })),
      });
      $dispatch(
        SET_USER({
          ...resp?.result,
        })
      );
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
          id: $user.id,
          ...payload,
        });
        // console.log(resp);
        $dispatch(
          SET_USER({
            ...resp?.result,
          })
        );
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
    if ($user.avatar) {
      new File([$user.avatar], "avatar");
    }
  }, [$user.avatar, $user]);

  return (
    <>
      {/* <h1>Biodata</h1> */}
      <Grid direction="column" py=".5rem" my="0" gutter="xl" justify="center">
        <Grid.Col span={$isMobile ? 12 : 3}>
          <Image
            width="100%"
            height={250}
            style={{
              borderRadius: "50%",
            }}
            src={(image && image.url) || $user.avatar}
            alt="Random image"
            withPlaceholder
          />
          <br />
          <FileInput
            placeholder={image?.name || "Klik Untuk Ganti Avatar"}
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
              placeholder={$user.name}
              {...$form.getInputProps("name")}
            />
            <TextInput
              mt="md"
              label="Email Anda"
              type="email"
              placeholder={$user.email}
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
              Perbarui
            </Button>
          </form>
        </Grid.Col>
      </Grid>
    </>
  );
}
