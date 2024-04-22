import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
        <div className="flex items-center space-x-2">
          <div className='font-semibold py-3 flex items-center gap-2'>
            <HomeIcon className='h-4 w-4' />
            Home
          </div>
          <Link
            className={buttonVariants()}
            href={`/r/create`}>
            Create Community
          </Link>
        </div>
      </div>

      <div>
        {/* TODO: add feed */}
        feed 
      </div>
    </>
  );
}
