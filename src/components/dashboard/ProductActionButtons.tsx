"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { togglePublishAction, deleteProductAction } from "@/actions/product.actions";
import toast from "react-hot-toast";

export function TogglePublishButton({
  productId,
  isPublished,
}: {
  productId: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await togglePublishAction(productId);
      if (result?.error) toast.error(result.error);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="p-1.5 text-clay-400 hover:text-oasis-600 hover:bg-oasis-50 rounded-lg transition-colors disabled:opacity-50"
      title={isPublished ? "Unpublish" : "Publish"}
    >
      {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

export function DeleteProductDashboardButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this product?")) return;
    startTransition(async () => {
      await deleteProductAction(productId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-clay-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
