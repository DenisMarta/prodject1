import React from 'react';
import Styles from './Data.scss';
import DNACard from 'components/card/Card';
import headerImageURL from '../../../assets/images/Data-Landing.png';
import { DataLandingPageElements } from 'globals/landingPageElements';
import LandingSummary from '../shared/landingSummary/LandingSummary';

export interface DataLandingPageIconsType {
  svgIconId: string;
  svgIcon: JSX.Element;
}

const Data = () => {
  const cards = DataLandingPageElements;
  return (
    <LandingSummary
      title={'Data'}
      subTitle={
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
      tags={['Lorem Ipsum', 'ABC', 'XYZ']}
      headerImage={headerImageURL}
      isBackButton={true}
    >
      <div className={Styles.workspacesWrapper}>
        {cards.map((card, index) => {
          return (
            <DNACard
              key={index}
              title={card.name}
              description={card.description}
              url={card.url}
              isExternalLink={card.isExternalLink}
              isTextAlignLeft={card.isTextAlignLeft}
              isDisabled={card.isDisabled}
              isSmallCard={card.isSmallCard}
              isMediumCard={card.isMediumCard}
              svgIcon={card.svgIcon}
              className="data"
            />
          );
        })}
      </div>
    </LandingSummary>
  );
};

export default Data;