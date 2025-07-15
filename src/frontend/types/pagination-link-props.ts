import type { ButtonProps } from "@/components/ui/button";

export type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> & React.ComponentProps<"a">;
