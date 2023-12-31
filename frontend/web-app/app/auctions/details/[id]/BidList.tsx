"use client";

import { getBidsForAuction } from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import { useBidStore } from "@/hooks/useBidStore";
import { Auction, Bid } from "@/types";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BidItem from "./BidItem";
import { numberWithCommas } from "@/app/lib/numberWithCommas";
import EmptyFilter from "@/app/components/EmptyFilter";
import BidForm from "./BidForm";

type Props = {
  user: User | null;
  auction: Auction;
};

export default function BidList({ user, auction }: Props) {
  const [loading, setLoading] = useState(true);
  const bids = useBidStore((state) => state.bids);
  const setBids = useBidStore((state) => state.setBids);
  const open = useBidStore((state) => state.open);
  const setOpen = useBidStore((state) => state.setOpen);
  const openForBids = new Date(auction.auctionEnd) > new Date();

  const highBid = bids.reduce(
    (prev, current) =>
      prev > current.amount
        ? prev
        : current.bidStatus.includes("Accepted")
        ? current.amount
        : prev,
    0
  );

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response: any = await getBidsForAuction(auction.id);

        if (response.error) {
          throw response.error;
        }

        setBids(response as Bid[]);
        setLoading(false);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchBids();
  }, [auction.id, setBids]);

  useEffect(() => {
    setOpen(openForBids);
  }, [openForBids, setOpen]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="rounded-lg shadow-md">
      <div className="py-2 px-4 bg-white">
        <div className="sticky top-0 bg-white p-2">
          <Heading title={`Current high bid is ${numberWithCommas(highBid)}`} />
        </div>
      </div>
      <div className="overflow-auto h-[400px] flex flex-col-reverse px-2">
        {bids.length === 0 ? (
          <EmptyFilter
            title="No bids for this item"
            subtitle="Please feel free to place a bid"
          />
        ) : (
          <>
            {bids.map((bid) => (
              <BidItem key={bid.id} bid={bid} />
            ))}
          </>
        )}
      </div>
      <div className="px-2 pb-2">
        {!open ? (
          <div className="flex items-center justify-center p-2 font-semibold">
            This auction has finished
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center p-2 font-semibold">
            Pelase login to make a bid
          </div>
        ) : user && user.username === auction.seller ? (
          <div className="flex items-center justify-center p-2 font-semibold">
            You cannot bid on your own auction
          </div>
        ) : (
          <BidForm auctionId={auction.id} highBid={highBid} />
        )}
      </div>
    </div>
  );
}
