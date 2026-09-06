"use client";

import {
  BookOpen01Icon,
  Calendar01Icon,
  File01Icon,
  FileValidationIcon,
  Folder01Icon,
  InboxIcon,
  Notification01Icon,
  Task01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const ICON_CLASS = "size-10 opacity-80";

export const emptyStateIcons = {
  profile: <HugeiconsIcon icon={UserAccountIcon} className={ICON_CLASS} />,
  documents: <HugeiconsIcon icon={File01Icon} className={ICON_CLASS} />,
  applications: <HugeiconsIcon icon={FileValidationIcon} className={ICON_CLASS} />,
  consultations: <HugeiconsIcon icon={Calendar01Icon} className={ICON_CLASS} />,
  notifications: <HugeiconsIcon icon={Notification01Icon} className={ICON_CLASS} />,
  tasks: <HugeiconsIcon icon={Task01Icon} className={ICON_CLASS} />,
  blog: <HugeiconsIcon icon={BookOpen01Icon} className={ICON_CLASS} />,
  folder: <HugeiconsIcon icon={Folder01Icon} className={ICON_CLASS} />,
  inbox: <HugeiconsIcon icon={InboxIcon} className={ICON_CLASS} />,
};
