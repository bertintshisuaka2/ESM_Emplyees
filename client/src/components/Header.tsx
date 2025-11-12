import { APP_LOGO, APP_TITLE } from "@/const";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-primary py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          <img
            src={APP_LOGO}
            alt={APP_TITLE}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              DivaLaser
            </h1>
            <p className="text-sm sm:text-base text-yellow-400/80 font-medium">
              Software Solutions
            </p>
          </div>
          <img
            src="/professional-photo.png"
            alt="Professional Photo"
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
