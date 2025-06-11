"use client";

import { stockModelSchema, StockModelSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";
import { ILogisticsStuffModel, IStockFilterModel, IStockModel } from "@/types/logistics";
import { addStock, fetchStocks } from "@/store/slices/logisticsSlice";
import { useGenericModal } from "@/contexts/GenericModalContext";
import useSession from "@/hooks/useSession";

export default function FormAddStock({ logisticsStuffOptions }: { logisticsStuffOptions: ILogisticsStuffModel[] }) {
  const methods = useForm<StockModelSchema>({
    resolver: zodResolver(stockModelSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = methods;

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.logistics.loading);
  const modal = useGenericModal();
  const auth = useSession();
  const isOperation = auth.role === "operation";

  const { show, hide } = useLoading();

  useEffect(() => {
    if (loading) show();
    else hide();
  }, [loading]);

  const onSubmit = async (data: StockModelSchema) => {
    try {
      const result = await dispatch(addStock({ data: data as IStockModel })).unwrap();
      if (result) {
        if (result.isValidData) {
          modal.showModal(
            {
              type: "success",
              title: "Sucesso",
              buttonLabel: "Fechar",
              message: result.additionalMessage,
            },
            () => {
              reset();
            }
          );
          const filterStock: IStockFilterModel = {};
          dispatch(fetchStocks({ filterStock: filterStock }));
        } else {
          modal.showModal(
            {
              type: "error",
              title: "Erro",
              buttonLabel: "Fechar",
              message: result.additionalMessage,
            },
            () => {}
          );
        }
      }
    } catch (error: string | any) {}
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90vw] md:w-full md:px-5 mx-auto">
        <div className="flex flex-col md:flex-row gap-6 py-5">
          <div className="flex flex-col basis-1/4">
            <Controller
              name="logisticsStuffId"
              control={methods.control}
              render={({ field }) => (
                <div className="w-full">
                  <CustomSelect
                    options={logisticsStuffOptions.map((item) => ({
                      id: item.id ?? "",
                      value: item.name ?? "",
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    name="logisticsStuffId"
                    label="Nome do Equipamento"
                  />
                </div>
              )}
            />
            {!isOperation && errors?.logisticsStuffId && <span className="flex text-sm text-red-500 mt-1 block">{errors.logisticsStuffId.message as string}</span>}
          </div>
          <div className="flex flex-col basis-1/4">
            <Input type="number" {...register("quantity")} placeholder="Quantidade" inputPlaceholder="Digite aqui..." />
            {!isOperation && errors?.quantity && <span className="flex text-sm text-red-500 mt-1 block">{errors.quantity.message as string}</span>}
          </div>
          <div className="flex flex-col basis-1/4">
            <Input type="date" {...register("expirationDate")} placeholder="Validate do Lote" inputPlaceholder="Selecione a data..." />
            {!isOperation && errors?.expirationDate && <span className="flex text-sm text-red-500 mt-1 block">{errors.expirationDate.message as string}</span>}
          </div>
          <div className="flex flex-col basis-1/4">
            <Input type="date" {...register("createdOn")} placeholder="Data de Recebimento" inputPlaceholder="Selecione a data..." />
            {!isOperation && errors?.createdOn && <span className="flex text-sm text-red-500 mt-1 block">{errors.createdOn.message as string}</span>}
          </div>
        </div>
        <div className="flex flex-row justify-between md:justify-end py-6 gap-4">
          <Button
            variant={"outlineMainlilly"}
            size="lg"
            onClick={() => {
              reset();
            }}
            className="basis-1/2 md:basis-[17%] font-bold"
          >
            Limpar Tudo
          </Button>
          {isOperation ? (
            <Button
              type="button"
              variant={"default"}
              size="lg"
              className="basis-1/2 md:basis-[17%] font-bold"
              onClick={() => {
                const filterStock: IStockFilterModel = methods.getValues();
                dispatch(fetchStocks({ filterStock }));
              }}
            >
              Buscar Material
            </Button>
          ) : (
            <Button type="submit" variant={"default"} size="lg" className="basis-1/2 md:basis-[17%] font-bold" disabled={!isValid}>
              Cadastrar Material
            </Button>
          )}
        </div>
        <div className="border-b border-b-gray-400 mb-12"></div>
      </form>
    </FormProvider>
  );
}