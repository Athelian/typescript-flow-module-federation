import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import Card from './index';
import BaseAction from './Actions/BaseAction';

const actions = [
  <BaseAction action="archive" onClick={() => console.log('archive')} />,
  <BaseAction action="clone" onClick={() => console.log('onClone')} />,
  <BaseAction action="remove" onClick={() => console.log('onRemove')} />,
];

storiesOf('Card', module)
  .add('Default', () => (
    <div style={{ margin: '100px' }}>
      <Card
        color="YELLOW"
        icon="fasShip"
        onSelect={() => console.log('card selected!')}
        actions={actions}
      >
        {() => <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>}
      </Card>
    </div>
  ))
  .add('show Actions onHover', () => (
    <div style={{ margin: '100px' }}>
      <Card
        color="YELLOW"
        icon="fasShip"
        showActionsOnHover
        onSelect={() => console.log('card selected!')}
        actions={actions}
      >
        {() => <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>}
      </Card>
    </div>
  ))
  .add('Disabled', () => (
    <Card
      color="YELLOW"
      icon="fasShip"
      selectable
      selected
      disabled
      onSelect={() => console.log('card selected!')}
      actions={actions}
    >
      {() => <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>}
    </Card>
  ))
  .add('Selectable', () => (
    <Card
      color="YELLOW"
      icon="fasShip"
      selectable
      onSelect={() => console.log('card selected!')}
      actions={actions}
    >
      {() => (
        <div style={{ width: '200px', height: '250px' }}>
          <a href="https://zeport.io">
            make sure any link inside a card dont go anywhere if the card is selectable
          </a>
        </div>
      )}
    </Card>
  ))
  .add('Selected', () => (
    <Card
      color="YELLOW"
      icon="fasShip"
      selectable
      selected
      onSelect={() => console.log('card selected!')}
      actions={actions}
    >
      {() => <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>}
    </Card>
  ));
