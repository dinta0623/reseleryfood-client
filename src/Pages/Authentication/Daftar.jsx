import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Box,
  createStyles,
  Title,
  Flex,
  Modal,
  Checkbox,
  Text,
  ActionIcon,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { useApi } from "@/Utility/api";
import { ROLES } from "@/router";

export default function Daftar() {
  const navigate = useNavigate();
  const { classes } = createStyles((theme) => ({
    container: {
      minHeight: "100vh",
    },
  }))();

  const $isMobile = useMediaQuery("(max-width: 80em)");
  // const [errors, ]
  const [openModalError, setModalError] = useDisclosure(false);
  const [mainLoading, setMainLoading] = useDisclosure(false);
  const [isMitra, setIsMitra] = useState(false);

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
        /^\S+@\S+$/.test(value) ? null : "Email yang Anda masukkan tidak valid",
      password: (value) =>
        value.length < 8 ? "Password setidaknya terdiri dari 8 karakter" : null,
    },

    // transformValues: (values) => ({
    //     slug: `${values.name}-${values.email}`,
    //     ...values,
    // }),
  });

  const onSubmit = async (payload) => {
    try {
      nprogress.start();
      if ($form.isValid()) {
        // if (isMitra) {
        //   payload.roles = "(mitra)";
        // }
        await useApi.post("/users", {
          ...payload,
          roles: [ROLES.customer],
        });

        showNotification({
          title: "Berhasil",
          message:
            "Berhasil mendaftarkan akun Anda, silahkan login untuk melanjutkan 🤥",
          top: true,
        });

        $form.reset();
      }
    } catch (error) {
      if (error?.data?.message && typeof error?.data?.message == "object") {
        Object.keys(error?.data?.message).forEach((key) => {
          $form.setFieldError(key, error?.data?.message[key]);
        });
      }
      $form.isValid();
      setModalError.open();
    } finally {
      nprogress.complete();
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal
        opened={openModalError}
        onClose={setModalError.close}
        title="Perhatian"
        centered
      >
        <Title order={1} size="h2">
          Terdapat Kesalahan
        </Title>
        <br />
        <Text>
          Terdapat kesalahan ketika mendaftarkan akun. Coba lagi nanti
        </Text>
        <br />
        <br />
        <Button onClick={setModalError.close} type="submit" mt="md" fullWidth>
          Tutup
        </Button>
      </Modal>

      <div className={["dotted", classes.container].join(" ")}>
        <Flex align="center" justify="center" gap={0} h="100vh">
          <Box
            miw={$isMobile ? "90%" : "500px"}
            m="auto"
            sx={(theme) => ({
              background: "white",
              padding: $isMobile ? "1rem" : "2rem",
            })}
          >
            <ActionIcon onClick={() => navigate("/")}>
              <i className="ri-arrow-left-line ri-xl"></i>
            </ActionIcon>
            <Title order={1} size="h1">
              Daftar Akun
            </Title>
            <br />
            <form onSubmit={$form.onSubmit(onSubmit)}>
              <TextInput
                label="Nama Lengkap"
                placeholder="Tuliskan nama Anda"
                {...$form.getInputProps("name")}
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="Email ex: nama@email.com"
                mt="md"
                {...$form.getInputProps("email")}
              />
              <TextInput
                type="password"
                placeholder="Password min. 8 karakter"
                label="Kata Sandi"
                mt="md"
                {...$form.getInputProps("password")}
              />
              {/* <Checkbox
                label="Saya mendaftar sebagai mitra (Opsional)"
                checked={isMitra}
                onChange={(event) => setIsMitra(event.currentTarget.checked)}
                mt="md"
              /> */}
              <Button disabled={mainLoading} type="submit" mt="md" fullWidth>
                Daftar
              </Button>
            </form>
            <br />
            <Text td="underline" onClick={() => (location.href = "/masuk")}>
              Sudah punya akun?
            </Text>
          </Box>
        </Flex>
      </div>
    </>
  );
}
