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
      {({ targetted, toggle }) => (
        <>
          <Action icon="MAGIC" targetted={targetted} toggle={toggle} />
          <Action icon="DOCUMENT" targetted={targetted} toggle={toggle} />
          <Action icon="BRANCH" targetted={targetted} toggle={toggle} />
          <Action icon="CHECKED" targetted={targetted} toggle={toggle} />
        </>
      )}
    </ActionCard>
  </div>
));
