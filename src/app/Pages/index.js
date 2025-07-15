import Image from 'next/image';

export default function Home() {
  return (
    <div>
      {/* Navigation Bar */}
      <header className="nav-container">
        <nav className="navbar">
          <ul>
            <li><a href="#about">ABOUT ME</a></li>
            <li><a href="#services">SERVICES</a></li>
            <li><a href="#portfolio">PORTFOLIO</a></li>
            <li><a href="#packages">PACKAGES</a></li>
            <li><a href="#book-now">BOOK NOW</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* If you prefer a background image instead of Next.js <Image />, 
            you can use CSS background-image in the .hero-section style. 
            For demonstration, we use a full-viewport image with absolute positioning. */}
        <div className="hero-image-wrapper">
          <Image
            src="/Hero.png"
            alt="Hero"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="hero-content">
          {/* Logo or Icon can go here if you have one */}
          <div className="logo-box">
            <image src="/Westieelogo.png" alt="Logo" />
          </div>
          <h1 className="hero-title">Uncle Westiee<br />Studios</h1>
        </div>
      </section>

      <style jsx>{`
        /* Basic Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body, html {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #fff;
          color: #333;
          scroll-behavior: smooth;
        }

        /* Navigation Bar */
        .nav-container {
          position: fixed;
          top: 0;
          width: 100%;
          background-color: #111; /* or a dark gradient if you prefer */
          z-index: 1000;
        }
        .navbar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        .navbar ul {
          display: flex;
          justify-content: flex-end; /* move links to the right, or center if you prefer */
          list-style: none;
        }
        .navbar li {
          margin-left: 2rem;
        }
        .navbar a {
          text-decoration: none;
          color: #fff;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .navbar a:hover {
          color: #f0c14b; /* example hover color */
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh; /* full screen height */
          overflow: hidden;
          margin-top: 60px; /* offset for the fixed navbar height */
        }
        .hero-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Hero Content (Text + Logo) */
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #fff;
        }
        .logo-box {
          width: 60px;
          height: 60px;
          border: 1px solid #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .logo-initials {
          font-weight: 700;
          font-size: 1.2rem;
        }
        .hero-title {
          font-size: 2.5rem;
          line-height: 1.2;
          letter-spacing: 2px;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .navbar ul {
            justify-content: center;
          }
          .hero-title {
            font-size: 2rem;
          }
          .navbar li {
            margin-left: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
