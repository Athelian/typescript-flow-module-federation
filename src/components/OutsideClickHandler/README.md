Outside Click Handler example

```js
<OutsideClickHandler onOutsideClick={() => console.warn('click outside')}>
  Click outside of this element and see on the console log.
</OutsideClickHandler>
```

Ignore element example

```js
<OutsideClickHandler
  ignoreElements={[document.body]}
  onOutsideClick={() => console.warn('it should not trigger')}
>
  This will not fire onOutsideClick() because we ignore the document.body element.
</OutsideClickHandler>
```
