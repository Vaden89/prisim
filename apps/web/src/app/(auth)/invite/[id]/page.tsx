"use client";
import { toast } from "sonner";
import { Button } from "@repo/ui";
import { api } from "@repo/convex/api";
import { ConvexError } from "convex/values";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/common/spinner";
import { capitalizeFirstLetter } from "@/utils/string";
import { useParams, useRouter } from "next/navigation";
import { getConvexErrorMessage } from "@/lib/convex-error";
import { NotFoundState } from "@/components/common/not-found-state";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

export default function InvitationPage() {
  const { id } = useParams();
  const router = useRouter();
  const invitation = useQuery(
    api.invitation_functions.getInvitation,
    id ? { invitationId: id as string } : "skip",
  );
  const acceptInvitation = useMutation(
    api.invitation_functions.acceptInvitation,
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && id) {
      router.push(`/login?invitation-id=${id}`);
      localStorage.setItem("invitation-id", id as string);
    }
  }, [isLoading, isAuthenticated, router, id]);

  if (!id) return <NotFoundState />;

  if (invitation === undefined || isLoading)
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );

  if (invitation === null && !isAccepting) return <NotFoundState />;

  if (invitation?.isExpired)
    return (
      <NotFoundState
        title="Invitation expired"
        description="This invitation has expired. Please ask your workspace admin to send you a new one."
      />
    );

  async function handleInvitation() {
    setIsAccepting(true);
    try {
      const orgId = await acceptInvitation({ invitationId: id as string });
      localStorage.removeItem("invitation-id");
      router.push(`/dashboard/${orgId}`);
    } catch (error) {
      setIsAccepting(false);

      if (error instanceof ConvexError) {
        const err = error as ConvexError<{ code: string }>;
        const code = err.data.code;
        if (code === "ALREADY_STAFF") {
          toast.error("You are already a staff member of this organization.");
          localStorage.removeItem("invitation-id");
          router.push(`/dashboard/${invitation?.organization?._id}`);
          return;
        }
        if (code === "INVITE_EXPIRED") {
          toast.error("This invitation has expired, please request a new one.");
          localStorage.removeItem("invitation-id");
          router.push(`/dashboard`);
          return;
        }
        return;
      }

      toast.error(getConvexErrorMessage(error));
    }
  }

  return (
    <div className="w-full min-h-dvh h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg p-10 bg-tertiary rounded-2xl border-outline-gray/50 border flex flex-col items-center">
        <div className="w-15 h-15 bg-outline-gray-800 flex items-center justify-center text-4xl rounded-2xl border border-outline-gray/50">
          {invitation?.organization?.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-semibold leading-[120%] tracking-[-4%] mt-2">
          {capitalizeFirstLetter(invitation?.organization?.name ?? "")}
        </h1>
        <div className="w-full bg-outline-gray-200 p-4 border border-outline-gray rounded-xl text-sm mt-4">
          <div className="flex items-center justify-between border-b border-outline-gray/50 pb-2">
            <span className="text-secondary">Assigned role:</span>
            <span>{invitation?.role}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-secondary">Email:</span>
            <span>{invitation?.email}</span>
          </div>
        </div>

        <Button
          loading={isAccepting}
          onClick={handleInvitation}
          className="mt-8 w-full py-3 rounded-xl"
        >
          Accept Invitation
        </Button>
      </div>
    </div>
  );
}
