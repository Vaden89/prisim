"use client";
import { useEffect, useState } from "react";

export function InviteInfoBanner() {
  const [invitationId, setInvitationId] = useState("");
  useEffect(() => {
    if (window) {
      const invitationId = localStorage.getItem("invitation-id");
      if (invitationId) {
        setInvitationId(invitationId);
      }
    }
  }, []);

  if (!invitationId) return null;

  return (
    <div className="absolute w-fit p-3 top-5 right-[50%] translate-x-[50%] bg-success/10 border border-success/80 text-success text-sm rounded-xl">
      You have to be logged in to accept this invitation, if you don&apos;t have
      an account please create one.
    </div>
  );
}
