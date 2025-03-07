import '@/styles/admin-styles.css';
import Navbar from "@/components/admin-components/Navbar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
