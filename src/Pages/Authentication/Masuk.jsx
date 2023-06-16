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
  Text,
  ActionIcon,
  Paper,
} from "@mantine/core";
import { useMediaQuery, useHover, useDisclosure } from "@mantine/hooks";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import { showNotification } from "@mantine/notifications";
import { AtomsContainer } from "@/Components/Atoms";
import { useSelector, useDispatch } from "react-redux";
import { SET_LOGIN } from "@/store/UserSlice";
import { useApi } from "@/utility/api";

export default function Masuk(props) {
  const $user = useSelector((state) => state.user);
  const $dispatch = useDispatch();
  const $isMobile = useMediaQuery("(max-width: 80em)");
  const $navigate = useNavigate();
  const { classes } = createStyles((theme) => ({
    container: {
      minHeight: "100vh",
    },
  }))();

  const [openModalError, setModalError] = useDisclosure(false);
  const [local, setLocal] = useState({
    mainError: null,
    mainLoading: false,
  });

  const $initialValues = {
    email: "",
    password: "",
  };

  const $form = useForm({
    validateInputOnChange: true,
    initialValues: $initialValues,
    validate: {
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

  const $startLoading = () => {
    setLocal((val) => ({ ...val, mainLoading: true }));
    nprogress.start();
  };
  const $endLoading = () => {
    setLocal((val) => ({ ...val, mainLoading: false }));
    nprogress.complete();
  };

  const $onSubmit = async (values) => {
    $startLoading();
    setLocal((val) => ({ ...val, mainError: null }));
    try {
      if ($form.isValid()) {
        const resp = await useApi.post("/login", values);
        $dispatch(SET_LOGIN(resp?.result));
        $navigate("/");
      }
      $form.reset();
    } catch (error) {
      // console.log(error);
      if (error?.data?.message && typeof error?.data?.message == "object") {
        Object.keys(error?.data?.message).forEach((key) => {
          $form.setFieldError(key, error?.data?.message[key]);
        });
      } else {
        setLocal((val) => ({ ...val, mainError: error?.data?.message }));
      }
      $form.isValid();
      setModalError.open();
    } finally {
      $endLoading();
    }
  };

  return (
    <>
      <Modal
        opened={openModalError}
        onClose={setModalError.close}
        title="Perhatian"
        centered
      >
        <br />
        <Title order={1} size="h2">
          Terdapat Kesalahan
        </Title>
        <br />
        <Text>
          Terdapat kesalahan ketika login. Pastikan kolom terisi dengan benar
        </Text>
        <br />
        <br />
        <Button onClick={setModalError.close} type="submit" mt="md" fullWidth>
          Tutup
        </Button>
      </Modal>

      <NavigationProgress progressLabel="Loading Page" />
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
            <ActionIcon onClick={() => $navigate("/")}>
              <i className="ri-arrow-left-line ri-xl"></i>
            </ActionIcon>
            <Title order={1} size="h1">
              Masuk Aplikasi
            </Title>
            {props.status && (
              <>
                <br />
                <Text color="red">*{props.status}</Text>
              </>
            )}
            <form onSubmit={$form.onSubmit($onSubmit)}>
              {local.mainError && (
                <>
                  <br />
                  <Paper
                    p="md"
                    sx={(theme) => ({
                      background: theme.colors.red[0],
                      padding: "1rem",
                    })}
                  >
                    <Text size="xs" color="red">
                      {local.mainError}
                    </Text>
                  </Paper>
                </>
              )}
              <TextInput
                disabled={local.mainLoading}
                label="Email"
                type="email"
                placeholder="nama@email.com"
                mt="md"
                {...$form.getInputProps("email")}
              />
              <TextInput
                disabled={local.mainLoading}
                type="password"
                placeholder="Password"
                label="Kata Sandi"
                mt="md"
                {...$form.getInputProps("password")}
              />
              <Button
                disabled={local.mainLoading}
                type="submit"
                mt="md"
                fullWidth
              >
                Masuk
              </Button>
            </form>
            <br />
            <Text td="underline" onClick={() => (location.href = "/daftar")}>
              Belum punya akun?
            </Text>
          </Box>
        </Flex>
      </div>
    </>
  );
}
