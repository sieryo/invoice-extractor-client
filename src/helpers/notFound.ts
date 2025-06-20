import { NotFoundError } from "@/errors";

export const throwNotFoundGroup = () => {
    throw new NotFoundError("Group not found.");
};
