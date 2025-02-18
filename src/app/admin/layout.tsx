import Navbar from "@/components/Navbar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
