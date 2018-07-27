```js
const SlideViewContent = ({ onRequestClose }) => (
  <button onClick={onRequestClose} type="button">
    close
  </button>
);

<SlideViewProvider
  renderContent={({ onRequestClose }) => <SlideViewContent onRequestClose={onRequestClose} />}
>
  {({ openSlideView }) => (
    <button
      type="button"
      onClick={() => {
        openSlideView({ width: 400 });
      }}
    >
      open SlideView
    </button>
  )}
</SlideViewProvider>;
```
