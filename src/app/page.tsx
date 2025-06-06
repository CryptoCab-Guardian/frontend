"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";

const DriverPage = () => {
  return (
    <>
    <Navbar/>
      <div className=" bg-gray-100">
        <div className="max-w-7xl flex flex-col md:flex-row items-center mx-auto px-4 ">
          {/* Left side - Image */}
          <div className="w-full md:w-3/4 relative mt-16 md:mb-8">
            <div className="flex justify-center">
              <video
                src="/home/taxi_waiting.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full  object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 md:pl-12 mt-24 ">
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Drive when you want, make what you need
            </h1>

            <p className="text-xl text-gray-700 mb-8">
              Make money on your schedule with deliveries or rides—or both. You
              can use your own car or choose a rental{" "}
              <Link href="/uber-rental" className="text-black hover:underline">
                through Uber
              </Link>
              .
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/pages/login"
                className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/**Second Part */}
      <div className=" py-9 ">
        <div className=" max-w-7xl flex flex-col md:flex-row items-center mx-auto px-4 py-12 ">
          {/* Left side - Content */}
          <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-8 md:mb-0 md:ml-16 ml-0">
            <h1 className="text-5xl font-bold leading-tight mb-6 text-[#333333]">
              The Uber you know, reimagined for business
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Uber for Business is a platform for managing global rides and
              meals, and local deliveries, for companies of any size.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/business/get-started"
                className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get started
              </Link>

              <Link
                href="/business/solutions"
                className="text-black hover:underline font-medium"
              >
                Check out our solutions
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="w-full md:w-1/2 ">
            <div className="relative aspect-w-16 aspect-h-12">
              <Image
                src="/home/home_image1.png"
                alt="Uber for Business illustration"
                width={500}
                height={600}
                className="rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {/**Third Part */}
      <div className=" ">
        <div className="max-w-7xl flex flex-col md:flex-row items-center mx-auto ">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 relative mt-16 md:mb-8">
            <div className="flex justify-center">
              <Image
                src="/home/safety.svg"
                alt="Uber for Business illustration"
                width={500}
                height={600}
                className="rounded-xl object-cover"
                priority
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 md:pl-12 mt-24 ">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Your safety drives us
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              Whether you’re in the back seat or behind the wheel, your safety
              is essential. We are committed to doing our part, and technology
              is at the heart of our approach. We partner with safety advocates
              and develop new technologies and systems to help improve safety
              and help make it easier for everyone to get around. .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverPage;
