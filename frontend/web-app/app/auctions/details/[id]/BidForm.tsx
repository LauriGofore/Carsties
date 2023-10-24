"use client";

import { placeBidForAuction } from "@/app/actions/auctionActions";
import { numberWithCommas } from "@/app/lib/numberWithCommas";
import { useBidStore } from "@/hooks/useBidStore";
import { Bid, BidFormData } from "@/types";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  auctionId: string;
  highBid: number;
};

export default function BidForm({ auctionId, highBid }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BidFormData>();

  const addBid = useBidStore((state) => state.addBid);

  const onSubmit: SubmitHandler<BidFormData> = async (data) => {
    if (data.amount <= highBid) {
      notifyAboutBid();
      reset();
      return;
    }
    try {
      const response: any = await placeBidForAuction(auctionId, +data.amount);

      if (response.error) throw response.error;

      addBid(response as Bid);
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const notifyAboutBid = () => {
    toast.error("Bid must be at least 1 higher than the current bid");
    return "Bid must be at least 1 higher than the current bid";
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center border-2 rounded-lg py-2"
    >
      <input
        type="number"
        {...register(
          "amount" /*  {
          validate: (value) => +value > highBid && notifyAboutBid(),
        } */
        )}
        className="input-custom text-sm text-gray-600"
        placeholder={`Enter your bid (minimum bid is ${numberWithCommas(
          highBid + 1
        )})`}
      />
    </form>
  );
}
