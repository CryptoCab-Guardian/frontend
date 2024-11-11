
import Link from "next/link";

const Login = () => {
  return (
    <div className=" h-screen">
      <div className="flex justify-around items-center bg-gray-100">
        <div className="text-6xl font-bold mb-4 w-1/2 mx-auto ml-28">
          Log in to access your account
        </div>
        <div className="flex w-1/2 ml-8">
          <Link href="/rider">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg  transition-colors">
              <img
                src="/home/female-passenger.webp"
                alt="Rider"
                className="w-full h-full mb-2"
              />
            </div>
          </Link>
          <Link href="/driver">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg  transition-colors mt-5">
              <img
                src="/home/cab-driver.webp"
                alt="Driver"
                className="w-full h-full"
              />
            </div>
          </Link>
        </div>
      </div>
      <div className=" flex justify-around  px-8 text-5xl my-10 ">
        {/* Driver Section */}
        <div className="text-center cursor-pointer text-5xl">
          <p className="font-bold">Driver</p>
          <div className="mt-1  font-semibold">→</div>
          <hr className="mt-2 border-t-2 border-black w-full" />
        </div>

        {/* Rider Section */}
        <div className="text-center cursor-pointer">
          <p className="font-bold">Rider</p>
          <div className="mt-1 font-semibold">→</div>
          <hr className="mt-2 border-t-2 border-black w-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
