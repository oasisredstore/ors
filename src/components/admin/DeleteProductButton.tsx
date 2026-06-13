"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { adminDeleteProductAction } from "@/actions/admin.actions";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await adminDeleteProductAction(productId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-clay-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
