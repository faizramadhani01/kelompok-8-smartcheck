import React from 'react';
import HeroSlider from '../components/HeroSlider.jsx';
import PromoSection from '../components/PromosSection.jsx';
import WhyMaju from '../components/WhyMaju.jsx';

function HomePage({ promos }) {
  return (
    <>
      <HeroSlider  />
      <PromoSection promos={promos} />
      <WhyMaju />
    </>
  );
}

export default HomePage;
