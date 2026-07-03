import Navbar from '../Components/navbar';

export default function BookNowPage() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-4xl font-bold mb-6">INQUIRE NOW</h1>
        <p className="max-w-2xl text-center text-lg text-gray-700">
          Provide a form or instructions for clients to book a session with you.
        </p>
      </section>
    </>
  );
}
