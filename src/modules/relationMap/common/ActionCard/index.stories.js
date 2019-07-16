/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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
    <div>{faker.name.findName()}</div>
    <ActionCard show>
      <>
        <Action icon="MAGIC" targeted={false} onClick={action('click')} />
        <Action icon="DOCUMENT" targeted={false} onClick={action('click')} />
        <Action icon="BRANCH" targeted={false} onClick={action('click')} />
        <Action icon="CHECKED" targeted onClick={action('click')} />
      </>
    </ActionCard>
  </div>
));
