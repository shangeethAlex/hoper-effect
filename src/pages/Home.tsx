import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { CoconutIslandHopper } from '../components/CoconutIslandHopper';
import { IslandJourney } from '../components/IslandJourney';
// import { FugaPosters } from '../components/FugaPosters';
import { CocktailSection } from '../components/CocktailSection';
import { SpecialDishes } from '../components/SpecialDishes';
// import { SplitSections } from '../components/SplitSections';
import { FindYourIsland } from '../components/FindYourIsland';
import { IslandShowcase } from '../components/IslandShowcase';
import { JournalTeaser } from '../components/JournalTeaser';
import { Reviews } from '../components/Reviews';
import { GiftCardsTeaser } from '../components/GiftCardsTeaser';
import { Reservation } from '../components/Reservation';
import { Footer } from '../components/Footer';
import { useScrollAnimations, useParallax, useCounters } from '../hooks/useScrollAnimations';
import { useSeo } from '../hooks/useSeo';

export function Home() {
  useScrollAnimations();
  useParallax('[data-parallax]', 0.12);
  useCounters();

  useSeo({
    title: 'The Coconut Island | Sri Lankan Street Food & Cocktails',
    description:
      'Authentic Sri Lankan street food, tropical cocktails & island vibes in Brighton and Angel, London. Pick your flavour, book a table — #pureislandvibes.',
    path: '/',
  });

  return (
    <div className="min-h-screen bg-navy-500 text-navy-500">
      <Header />
      <main>
        {/* Narrative arc: hook (Hero) → journey (pinned story filmstrip) →
            Showcase → story detail (BistroStory + island heritage) →
            food (Cocktails + Menu/Events) → book. */}
        <Hero />
        <CoconutIslandHopper />
        <IslandJourney />
        {/* <FugaPosters /> */}
        <IslandShowcase />
        <CocktailSection />
        <SpecialDishes />
        {/* <SplitSections /> */}
        <FindYourIsland />
        <Reviews />
        <JournalTeaser />
        <GiftCardsTeaser />
        <Reservation />
      </main>
      <Footer />
    </div>
  );
}
