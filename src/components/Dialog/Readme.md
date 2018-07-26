Wrap trigger with DialogProvider from ('src/components/Dialog/index')

DialogProvider provides a function that takes 2 args

`openDialog(contentComponent, { contentWidth: number, ...otherProps })`

```js
const NestedDialog = ({ onRequestClose }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <button onClick={onRequestClose} type="button">
      close dialog
    </button>
  </div>
);

const DialogContent = ({ onRequestClose, openDialog }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <button onClick={onRequestClose} type="button">
      close dialog
    </button>
    <div style={{ marginTop: '16px' }}>
      <button onClick={() => openDialog(NestedDialog, {})} type="button">
        Open nested dialog
      </button>
      <div>which just changes content.</div>
    </div>
  </div>
);

<DialogProvider>
  {({ openDialog }) => (
    <button type="button" onClick={() => openDialog(DialogContent, { contentWidth: 300 })}>
      open Dialog
    </button>
  )}
</DialogProvider>;
```
