import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import cs from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export type NavProp = { name: string; link: string };

interface Props {
  className?: string;
  navs?: Array<NavProp> | string;
}

export const BreadcrumbComp = ({ className, navs = [] }: Props) => {
  const { query, pathname } = useRouter();

  const parts = useMemo<NavProp[]>(() => {
    if (typeof navs === "string") {
      let lastLink = "";
      return navs.split("/").map((v) => {
        lastLink = [lastLink, v].join("/");
        return {
          name: v,
          link: lastLink,
        };
      });
    }
    return navs;
  }, [navs]);

  return (
    <div className={cs("flex items-center w-max h-8 px-2", className)}>
      <Breadcrumb className="md:flex">
        <BreadcrumbList>
          {parts.map(({ name, link }, idx) => {
            const isLast = idx === parts.length - 1;

            if (!isLast) {
              return (
                <>
                  <BreadcrumbItem key={idx}>
                    <BreadcrumbLink asChild>
                      <Link href={link}>{name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              );
            } else {
              return (
                <BreadcrumbItem key={idx}>
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            }
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
