'use client';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

export default function URLBar() {
  let router = useRouter();
  let [isReloading, setIsReloading] = useState(false);

  return (
    <>
      <div /> {/* https://github.com/vercel/next.js/issues/28778 */}
      <div className="shadow p-2 bg-gray-50/90 backdrop-blur-xl flex gap-2 z-10 sticky top-0 items-center">
        <div className="flex gap-1">
          <button
            disabled={isReloading}
            className="p-1 rounded-full enabled:hover:bg-gray-300 enabled:hover:text-gray-500 enabled:transition disabled:opacity-50 text-gray-400"
            onClick={() => {
              router.back();
            }}
          >
            <ChevronLeftIcon width="18" height="18" />
          </button>
          <button
            disabled={isReloading}
            className="p-1 rounded-full enabled:hover:bg-gray-300 enabled:hover:text-gray-500 enabled:transition disabled:opacity-50 text-gray-400"
            onClick={() => {
              router.forward();
            }}
          >
            <ChevronRightIcon width="18" height="18" />
          </button>
          <button
            className="p-1 rounded-full enabled:hover:bg-gray-300 enabled:hover:text-gray-500 enabled:transition text-gray-400 disabled:opacity-50"
            disabled={isReloading}
            onClick={() => {
              setIsReloading(true);
              window.location.reload();
            }}
          >
            <ReloadIcon width="18" height="18" />
          </button>
        </div>
        <span className="bg-gray-400/25 rounded-full truncate grow px-3 mr-3 py-1.5 text-gray-700 font-medium text-xs">
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
