import { formatDistanceToNow } from "date-fns";

export const formatTimeAgo = (date: Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
