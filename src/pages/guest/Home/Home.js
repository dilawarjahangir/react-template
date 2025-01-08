import React from "react";
import Divider from '@mui/material/Divider';

import GuestLayout from "../../../layouts/GuestLayout";

import Hero from './components/Hero.js';
import LogoCollection from './components/LogoCollection.js';
import Features from './components/Features.js';
import Testimonials from './components/Testimonials.js';
import Highlights from './components/Highlights.js';
import Pricing from './components/Pricing.js';
import FAQ from './components/FAQ.js';



const Home = () => {
  return (
    <GuestLayout>
      <Hero />
      <LogoCollection />
      <Features />
      <Divider />

      <Testimonials />
      <Divider />
      
      <Highlights />
      <Divider />
      
      <Pricing />
      <Divider />
      
      <FAQ />
      <Divider />
    </GuestLayout>
  );
};

export default Home;
