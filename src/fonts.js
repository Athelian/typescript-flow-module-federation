// @flow
import FontFaceObserver from 'fontfaceobserver';

const FONT_LOAD_TIMEOUT = 60 * 1000;

const loadFonts = () => {
  // Observe loading of Source Sans Pro and Noto Sans JP
  const sourceSansObserver = new FontFaceObserver('Source Sans Pro', {});
  const notoSansObserver = new FontFaceObserver('Noto Sans JP', {});

  // Load English font and change font family
  sourceSansObserver.load(null, FONT_LOAD_TIMEOUT).then(() => {
    if (document.body) document.body.classList.add('ssp');
  });

  // Load JP font and change font family
  notoSansObserver.load(null, FONT_LOAD_TIMEOUT).then(() => {
    if (document.body) document.body.classList.add('sspnsjp');
  });
};

export default loadFonts;
