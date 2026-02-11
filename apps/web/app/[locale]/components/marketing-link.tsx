import NextLink, { type LinkProps } from "next/link";

export function Link(props: LinkProps & React.ComponentProps<"a">) {
  return <NextLink data-hover {...props} />;
}
