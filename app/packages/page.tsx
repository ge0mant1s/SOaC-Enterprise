import NavBar from '../components/nav-bar';
import Footer from '../components/footer';
import PackagesContent from './_components/packages-content';

export default function PackagesPage() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="pt-16">
        <PackagesContent />
      </div>
      <Footer />
    </main>
  );
}
