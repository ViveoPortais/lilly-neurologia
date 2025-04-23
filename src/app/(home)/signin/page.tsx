"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "react-toastify";
import dayjs from "dayjs";
import { CgSpinner } from "react-icons/cg";

import useSession from "@/hooks/useSession";
import { login, resendToken } from "@/services/auth";
import api from "@/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ILoginData, IResendToken } from "@/types";
import { CustomSelect } from "@/components/custom/CustomSelect";
import Link from "next/link";
import { useGenericModal } from "@/contexts/GenericModalContext";

const signInValidationSchema = z.object({
  login: z.string().min(1, { message: "Informe o login" }),
  password: z.string().min(3, { message: "A senha deve conter pelo menos 3 caracteres" }),
  tokenByEmail: z.boolean().optional(),
  tokenBySms: z.boolean().optional(),
  token: z.string().optional(),
});

type SignInValidationProps = z.infer<typeof signInValidationSchema>;

export default function SignIn() {
  const router = useRouter();
  const auth = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenSended, setIsTokenSended] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tokenChannel, setTokenChannel] = useState<"email" | "sms" | "">("");
  const [token, setToken] = useState(["", "", "", ""]);
  const modal = useGenericModal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignInValidationProps>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      login: "",
      password: "",
      tokenByEmail: false,
      tokenBySms: false,
      token: "",
    },
    mode: "onChange",
  });

  const handleForgetPassword = () => {
    router.push("/forget/password");
  };

  function handleUserRole(role: string) {
    if (role.toLowerCase().includes("supervisor")) {
      return "supervisor";
    }
    if (role.toLowerCase().includes("representante")) {
      return "representative";
    }
    if (role.toLowerCase().includes("operação")) {
      return "operation";
    }
    return "";
  }

  async function handleLogin(data: SignInValidationProps) {
    modal.showModal({
      type: "warning",
      message:
        "Seu cadastro de pré-lançamento do Programa Diagnóstico Correto Neurologia foi confirmado. Em breve você poderá solicitar exame de Líquor para seus pacientes. Aguarmos você no grande dia!",
    });
    return;
    setIsLoading(true);

    try {
      const tokenFinal = token.join("") || data.token;

      const loginData: ILoginData = {
        login: data.login,
        password: data.password,
        tokenByEmail: tokenChannel === "sms" || tokenChannel === "" ? false : true,
        tokenBySms: tokenChannel === "email" || tokenChannel === "" ? false : true,
        token: tokenFinal,
      };

      if (step === 1) {
        setStep(2);
        return;
      }

      if (step === 2) {
        if (!tokenChannel) {
          toast.warning("Selecione uma forma de recebimento do token");
          return;
        } else {
          const response = await login(loginData);
          toast.success(response.token);
          if (response.role === "") {
            setStep(3);
            setIsTokenSended(true);
            return;
          }
        }
      }
      if (step === 3) {
        const response = await login(loginData);
        const role = handleUserRole(response.role);
        if (role === "") {
          auth.onLogout();
          toast.warning("Usuário sem acesso a este programa");
          router.push("/signin");
          return;
        }
        auth.setProgramsCode(response.programsCode);
        auth.setName(response.userName);
        auth.setEmail(response.email);
        auth.setToken(response.token);
        api.defaults.headers.Authorization = `Bearer ${response.token}`;
        auth.setRole(role);
        auth.setSession(dayjs().format("YYYY-MM-DD HH:mm:ss"));
        auth.setPrimeiroAcesso(response.primeiroAcesso);
        auth.setObrigatorioAlterarSenha(response.obrigatorioAlterarSenha);
        auth.onLogin();
        router.push("/dashboard/program");
      }
    } catch (err: any) {
      toast.error(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendToken = (data: SignInValidationProps) => {
    setIsLoading(true);

    let dataSend: IResendToken = {
      email: data.login,
      password: data.password,
      token: data.token,
    };

    resendToken(dataSend)
      .then((res) => {
        if (res.isValidData) toast.success(res.additionalMessage);
      })
      .catch((res) => {
        toast.error(res.additionalMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTokenInput = (index: number, value: string) => {
    const updated = [...token];
    updated[index] = value;
    setToken(updated);
  };

  return (
    <form className="flex flex-col items-center gap-3 w-full h-full" onSubmit={handleSubmit(handleLogin)}>
      {step === 1 && (
        <>
          {/* ETAPA 1: Informar e-mail e senha */}
          <span className="self-start text-md text-zinc-700">Acesse com seu e-mail e senha abaixo:</span>
          <div className="w-full">
            <Input
              type="text"
              icon="login"
              placeholder="E-mail"
              className="w-full"
              {...register("login", { required: true })}
              maxLength={100}
            />
            {errors.login && <span className="w-full text-xs text-red-400 mt-1">{errors.login.message}</span>}
          </div>

          <div className="w-full">
            <Input
              type="password"
              icon="password"
              placeholder="Senha"
              className="w-full"
              {...register("password", { required: true })}
            />
            {errors.password && <span className="w-full text-xs text-red-400 mt-1">{errors.password.message}</span>}
          </div>
          <span onClick={handleForgetPassword} className="text-xs self-end underline cursor-pointer">
            Esqueci minha senha
          </span>
          <Button
            size={`lg`}
            variant={`default`}
            className={`w-full mt-4 ${isLoading && "bg-zinc-500"}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <CgSpinner size={20} className="text-white animate-spin" /> : "Entrar"}
          </Button>
          <Link href="/register" className="w-full">
            <Button
              size={`lg`}
              variant={"outlineMainlilly"}
              className={`w-full ${isLoading && "bg-zinc-500"}`}
              type="button"
              disabled={isLoading}
            >
              {isLoading ? <CgSpinner size={20} className="text-white animate-spin" /> : "Cadastre-se"}
            </Button>
          </Link>
        </>
      )}

      {step === 2 && (
        <>
          {/* ETAPA 2: Escolher tipo de envio */}
          <label className="w-full text-start mb-1 text-md text-zinc-700">
            Escolha a forma que deseja receber o Token:
          </label>
          <CustomSelect
            name="tokenChannel"
            label="Enviar token para:"
            value={tokenChannel}
            onChange={(value: any) => setTokenChannel(value as "email" | "sms")}
            options={[
              { id: "email", value: "E-mail" },
              { id: "sms", value: "SMS" },
            ]}
            customClass="w-full border rounded"
          />

          <Button size={`lg`} variant={`default`} type="submit">
            {isLoading ? <CgSpinner className="animate-spin" /> : "Enviar"}
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          {/* ETAPA 3: Inserir token */}
          <label className="w-full text-start mb-1 text-md text-zinc-700">
            Escolha a forma que deseja receber o Token:
          </label>
          <Input className="w-full" value={tokenChannel === "email" ? "E-mail" : "Sms"} disabled></Input>

          <div className="flex gap-4 mt-2">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                maxLength={1}
                className="w-full"
                onChange={(e) => handleTokenInput(index, e.target.value)}
              />
            ))}
          </div>

          <span onClick={() => handleResendToken(watch())} className="text-xs underline cursor-pointer mt-2">
            Enviar Novamente
          </span>

          <Button
            size={`lg`}
            variant={`default`}
            className={`w-full mt-4 ${isLoading && "bg-zinc-500"}`}
            type="submit"
            disabled={isLoading || !isTokenSended}
          >
            {isLoading ? <CgSpinner size={20} className="text-white animate-spin" /> : "Entrar"}
          </Button>
        </>
      )}
    </form>
  );
}
