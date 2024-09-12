'use client';

import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function URLBar() {
  let router = useRouter();
  let [isReloading, setIsReloading] = useState(false);

  return (
    <>
      <div className="p-2 bg-gray-100 flex gap-2 items-center">
        <div className="flex gap-1">
          <button
            disabled={isReloading}
            className="p-1 rounded-full enabled:hover:bg-gray-200 enabled:hover:text-gray-500 enabled:transition disabled:opacity-50 text-gray-400"
            onClick={() => {
              router.back();
            }}
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            disabled={isReloading}
            className="p-1 rounded-full enabled:hover:bg-gray-200 enabled:hover:text-gray-500 enabled:transition disabled:opacity-50 text-gray-400"
            onClick={() => {
              router.forward();
            }}
          >
            <ChevronRightIcon className="size-5" />
          </button>
          <button
            className="p-1 rounded-full enabled:hover:bg-gray-200 enabled:hover:text-gray-500 enabled:transition text-gray-400 disabled:opacity-50"
            disabled={isReloading}
            onClick={() => {
              setIsReloading(true);
              window.location.reload();
            }}
          >
            <ArrowPathIcon className="size-5" />
          </button>
        </div>
        <span className="bg-gray-200 rounded-full truncate grow px-3 mr-3 py-1.5 text-gray-500 font-medium text-xs">
          <Suspense>
            <FullURL />
          </Suspense>
        </span>
      </div>
    </>
  );
}

function FullURL() {
  let pathname = usePathname();
  let searchParams = useSearchParams();
  let url = new URL(pathname, 'http://foo.com');
  url.search = searchParams.toString();

  return pathname + url.search;
}
