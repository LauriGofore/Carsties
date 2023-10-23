"use client";

import { Button } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/Input";
import { Auction, AuctionFormData } from "@/types";
import { useEffect } from "react";
import DateInput from "../components/DateInput";
import { createAuction, updateAuction } from "../actions/auctionActions";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  auction?: Auction;
};

export default function AuctionForm({ auction }: Props) {
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isSubmitting, isValid },
  } = useForm<AuctionFormData>({
    mode: "onTouched",
    defaultValues: auction?.id ? { ...auction } : {},
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setFocus("make");
  }, [setFocus]);

  const onSubmit: SubmitHandler<AuctionFormData> = async (data) => {
    try {
      let id = "";
      let res;

      if (pathname === "/auctions/create") {
        res = await createAuction(data);
        id = res.id;
      } else {
        if (auction) {
          res = await updateAuction(data, auction.id);
          id = auction.id;
        }
      }

      if (res.error) {
        throw res.error;
      }

      router.push(`/auctions/details/${id}`);
    } catch (error: any) {
      toast.error(error.status + " " + error.message);
    }
  };

  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Make"
        name="make"
        control={control}
        rules={{ required: "Make is required" }}
      />
      <Input
        label="Model"
        name="model"
        control={control}
        rules={{ required: "Model is required" }}
      />
      <Input
        label="Color"
        name="color"
        control={control}
        rules={{ required: "Color is required" }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Year"
          name="year"
          type="number"
          control={control}
          rules={{ required: "Year is required" }}
        />
        <Input
          label="Mileage"
          name="mileage"
          control={control}
          rules={{ required: "Mileage is required" }}
        />
      </div>

      {pathname === "/auctions/create" && (
        <>
          <Input
            label="Image URL"
            name="imageUrl"
            control={control}
            rules={{ required: "Image URL is required" }}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Reserve Price (enter 0 if no reserve)"
              name="reservePrice"
              type="number"
              control={control}
              rules={{ required: "Reserve price is required" }}
            />
            <DateInput
              label="Auction end date/time"
              name="auctionEnd"
              control={control}
              rules={{ required: "Auction end date is required" }}
              dateFormat="dd MMMM yyyy h:mm a"
              showTimeSelect
            />
          </div>
        </>
      )}

      <div className="flex justify-between">
        <Button outline color="gray">
          Cancel
        </Button>
        <Button
          type="submit"
          color="success"
          disabled={isSubmitting || !isValid}
          isProcessing={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}