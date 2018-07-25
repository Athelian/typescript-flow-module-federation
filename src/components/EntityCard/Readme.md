- Card itself is flexible sizing based on its inner content.
- Click the icon at the corner to show actions

```js
let action = null;

const actions = [
  <BaseAction action="archive" onClick={() => (action = 'onArchive')} />,
  <BaseAction action="clone" onClick={() => (action = 'onClone')} />,
  <BaseAction action="remove" onClick={() => (action = 'onRemove')} />,
];

<div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-around' }}>
  <Card
    color="YELLOW"
    icon="fasShip"
    onSelect={() => (action = 'onSelect')}
    actions={actions}
    selectable
  >
    {() => <div style={{ width: '150px', height: '200px' }}>{action}</div>}
  </Card>
  <Card
    color="BLUE"
    icon="fasShip"
    onSelect={() => (action = 'onSelect')}
    actions={actions}
    selectable
    selected
  >
    {() => <div style={{ width: '200px', height: '100px' }}>{action}</div>}
  </Card>
  <Card
    color="RED"
    icon="fasShip"
    onSelect={() => (action = 'onSelect')}
    actions={actions}
    selectable
    disabled
  >
    {() => <div style={{ width: '300px', height: '150px' }}>{action}</div>}
  </Card>
</div>;
```

#### Show Actions on Hover:

give `showActionsOnHover: true` if you wanna show actions on hover

```js
let action = null;

const actions = [
  <BaseAction action="archive" onClick={() => (action = 'onArchive')} />,
  <BaseAction action="clone" onClick={() => (action = 'onClone')} />,
  <BaseAction action="remove" onClick={() => (action = 'onRemove')} />,
];

<div style={{ marginTop: '50px' }}>
  <Card
    color="YELLOW"
    icon="fasShip"
    onSelect={() => (action = 'onSelect')}
    actions={actions}
    showActionsOnHover
    selectable
  >
    {() => <div style={{ width: '150px', height: '200px' }}>{action}</div>}
  </Card>
</div>;
```
