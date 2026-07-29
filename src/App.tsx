import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { LocationPage } from './pages/LocationPage';
import { Cocktails } from './pages/Cocktails';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { GiftCards } from './pages/GiftCards';
import { CookieConsent } from './components/CookieConsent';
import { NewsletterPopup } from './components/Newsletter';
import { LOCATIONS } from './data/locations';

/** Reset scroll on route change — pages are long scroll experiences. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cocktails" element={<Cocktails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/brighton" element={<LocationPage key="brighton" location={LOCATIONS.brighton} />} />
        <Route path="/london" element={<LocationPage key="london" location={LOCATIONS.london} />} />
        {/* Aliases people are likely to type */}
        <Route path="/islington" element={<Navigate to="/london" replace />} />
        <Route path="/angel" element={<Navigate to="/london" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
      <NewsletterPopup />
    </BrowserRouter>
  );
}

export default App;
