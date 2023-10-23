"use client";

import { deleteAuction } from "@/app/actions/auctionActions";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doDelete = async () => {
    setLoading(true);

    try {
      const res = await deleteAuction(id);

      if (res.error) {
        throw res.error;
      }

      router.push("/");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.status + " " + error.message);
    }
  };

  return (
    <Button color="failure" isProcessing={loading} onClick={doDelete}>
      Delete Auction
    </Button>
  );
}
