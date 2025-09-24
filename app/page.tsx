import Image from "next/image";

export default function Page() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-500">Hello, Next.js!</h1>
      <Image src="/profile.png" alt="Profile" width={100} height={100} />
    </div>
  );
}
