// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ReactSVG from 'react-svg';
import {
  PageNotFoundWrapperStyle,
  PageNotFoundMessageWrapperStyle,
  PageNotFoundTitleStyle,
  PageNotFoundDescriptionStyle,
  PageNotFoundGraphicsWrapperStyle,
  PageNotFoundGraphicStyle,
} from './style';

const PageNotFound = () => (
  <div className={PageNotFoundWrapperStyle}>
    <div className={PageNotFoundMessageWrapperStyle}>
      <div className={PageNotFoundTitleStyle}>
        <FormattedMessage id="components.pageNotFound.title" defaultMessage="PAGE NOT FOUND" />
      </div>
      <div className={PageNotFoundDescriptionStyle}>
        <FormattedMessage
          id="components.pageNotFound.description"
          defaultMessage="SORRY, EITHER YOU DO NOT HAVE ACCESS TO THIS PAGE OR THIS PAGE DOES NOT EXIST AT ALL."
        />
      </div>
    </div>
    <ReactSVG
      src="error.svg"
      className={PageNotFoundGraphicsWrapperStyle}
      svgClassName={PageNotFoundGraphicStyle}
    />
  </div>
);

export default PageNotFound;
