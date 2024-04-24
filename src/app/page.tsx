import CustomFeed from "@/components/contents/custom-feed";
import GeneralFeed from "@/components/contents/general-feed";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession()
  
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        { session ? <CustomFeed /> : <GeneralFeed /> } 
      </div>
    </>
  );
}
