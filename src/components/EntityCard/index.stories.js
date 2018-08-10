import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Card from './index';
import EntityAction from './Actions/EntityAction';

const actions = [
  <EntityAction icon="CLONE" onClick={action('Cloned!!')} />,
  <EntityAction icon="REMOVE" hoverColor="RED" onClick={action('Removed!!')} />,
  <EntityAction icon="ARCHIVE" onClick={action('Archived!!')} />,
];

storiesOf('Card', module)
  .add('Default', () => (
    <div style={{ margin: '100px' }}>
      <Card color="YELLOW" icon="SHIPMENT" onSelect={action('Card Selected!!')} actions={actions}>
        <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>
      </Card>
    </div>
  ))
  .add('show Actions onHover', () => (
    <div style={{ margin: '100px' }}>
      <Card
        color="YELLOW"
        icon="SHIPMENT"
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
      icon="SHIPMENT"
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
      icon="SHIPMENT"
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
      icon="SHIPMENT"
      selectable
      selected
      onSelect={action('Card Selected!!')}
      actions={actions}
    >
      <div style={{ width: '200px', height: '250px' }}>Card Inner Content</div>
    </Card>
  ));
