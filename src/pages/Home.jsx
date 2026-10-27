import Hero from "../home/Hero.jsx";
import Designer from "../home/Designer.jsx";
import { Categories, Craft, Occasions, Services, Trending, TrustMarquee, Videos, WhyUs } from "../home/Sections.jsx";
import RecentlyViewed from "../components/RecentlyViewed.jsx";
import { useTitle } from "../components/FloatingActions.jsx";

export default function Home() {
  useTitle();
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Categories />
      <Trending />
      <Craft />
      <Occasions />
      <Designer />
      <WhyUs />
      <Services />
      <Videos />
      <RecentlyViewed />
    </>
  );
}
