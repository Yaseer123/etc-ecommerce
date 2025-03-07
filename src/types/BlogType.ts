import { type Post } from "@prisma/client";

export interface BlogType extends Post {
  createdBy: {
    id: string;
    name: string | null;
  };
}
