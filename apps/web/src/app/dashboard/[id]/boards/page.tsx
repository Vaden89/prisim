"use client";
import { EmptyBoards } from "@/components/boards/empty-boards";
import { useDashboard } from "@/contexts/dashboard-provider";
import { api } from "@repo/convex/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BoardsPage() {
  const router = useRouter();
  const { org } = useDashboard();
  const orgId = org.id;

  const boards = useQuery(api.board_functions.getBoards, { orgId });

  useEffect(() => {
    if (boards && boards.length > 0) {
      router.replace(`/dashboard/${orgId}/boards/${boards[0]?._id}`);
    }
  }, [boards, orgId, router]);

  if (boards === undefined || boards.length > 0) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <span className="text-secondary">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full">
      <EmptyBoards />
    </div>
  );
}
