import Navbar from '@/app/Components/navbar';
import Footer from '@/app/Components/footer';

export default function PublicLayout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
