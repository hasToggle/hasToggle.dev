import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/") || href?.startsWith("#")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...props }) => {
    if (!src) {
      return null;
    }

    return (
      <Image
        alt={alt ?? ""}
        className="rounded-xl"
        height={400}
        src={src}
        width={800}
        {...props}
      />
    );
  },
};
