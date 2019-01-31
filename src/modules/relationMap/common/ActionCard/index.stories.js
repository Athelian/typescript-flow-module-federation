/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import ActionCard, { Action } from './index';

const ContainerStyle = css`
  position: relative;

  width: 200px;
  height: 50px;

  border: 2px solid #fbaa1d;
  border-radius: 5px;
`;

storiesOf('RelationMap/ActionCard', module).add('ActionCard', () => (
  <div className={ContainerStyle}>
    <div>XXXXXXXXXXXXXXXXX</div>
    <ActionCard>
      {({ targeted, toggle }) => (
        <>
          <Action icon="MAGIC" targeted={targeted} toggle={toggle} />
          <Action icon="DOCUMENT" targeted={targeted} toggle={toggle} />
          <Action icon="BRANCH" targeted={targeted} toggle={toggle} />
          <Action icon="CHECKED" targeted={targeted} toggle={toggle} />
        </>
      )}
    </ActionCard>
  </div>
));
