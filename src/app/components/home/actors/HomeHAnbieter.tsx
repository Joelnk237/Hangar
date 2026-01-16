import React from 'react';
import HeroSub from '../../shared/hero-sub';
import Blog from '../../blog/blog-list';
import DiscoverProperties from '../property-option';
import Util from './Util';




export default function HomeFBesitzer() {

  return (
    <>
      <HeroSub title="Welcome"
          description="Firmenname"
        />
      <DiscoverProperties />
      <Util />
    </>
  )
}