import SignIn from "@/components/contents/sign-in";
import CloseModal from "@/components/layouts/close-modal";

export default function Page() {
  return (
    <div className='fixed inset-0 bg-background/20 z-10 backdrop-blur'>
      <div className='container flex items-center h-full max-w-lg mx-auto'>
        <div className='relative bg-background w-full h-fit py-20 px-2 rounded-lg'>
          <div className='absolute top-4 right-4'>
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  )
}
