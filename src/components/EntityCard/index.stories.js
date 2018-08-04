import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Card from './index';
import EntityAction from './Actions/EntityAction';

const actions = [
  <EntityAction icon="fasClone" onClick={action('Cloned!!')} />,
  <EntityAction icon="fasArchive" onClick={action('Removed!!')} />,
  <EntityAction icon="fasTrash" hoverColor="RED" onClick={action('Archived!!')} />,
];

storiesOf('Card', module)
  .add('Default', () => (
    <div style={{ margin: '100px' }}>
      <Card color="YELLOW" icon="fasShip" onSelect={action('Card Selected!!')} actions={actions}>
        <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>
      </Card>
    </div>
  ))
  .add('show Actions onHover', () => (
    <div style={{ margin: '100px' }}>
      <Card
        color="YELLOW"
        icon="fasShip"
        showActionsOnHover
        onSelect={action('Card Selected!!')}
        actions={actions}
      >
        <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>
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
      onSelect={action('Card Selected!!')}
      actions={actions}
    >
      <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>
    </Card>
  ))
  .add('Selectable', () => (
    <Card
      color="YELLOW"
      icon="fasShip"
      selectable
      onSelect={action('Card Selected!!')}
      actions={actions}
    >
      <div style={{ width: '200px', height: '250px' }}>
        <a href="https://zeport.io">
          make sure any link inside a card dont go anywhere if the card is selectable
        </a>
      </div>
    </Card>
  ))
  .add('Selected', () => (
    <Card
      color="YELLOW"
      icon="fasShip"
      selectable
      selected
      onSelect={action('Card Selected!!')}
      actions={actions}
    >
      <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>
    </Card>
  ));
