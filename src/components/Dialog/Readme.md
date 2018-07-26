Wrap trigger with DialogProvider from ('src/components/Dialog/index')

DialogProvider provides a function that takes 2 args

`openDialog(contentComponent, { contentWidth: number, ...otherProps })`

```js
const DialogContent = ({ onRequestClose }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <button onClick={onRequestClose} type="button">
      close dialog
    </button>
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
