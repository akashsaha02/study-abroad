"use client";

import { Button } from "antd";

interface UserRowActionsProps {
  userId: string;
  onEdit?: (id: string) => void;
}

export function UserRowActions({ userId, onEdit }: UserRowActionsProps) {
  return (
    <Button size="small" onClick={() => onEdit?.(userId)}>
      Edit
    </Button>
  );
}
