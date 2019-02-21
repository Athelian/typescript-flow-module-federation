// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ReactSVG from 'react-svg';
import { UIConsumer } from 'modules/ui';
import NavBar from 'components/NavBar';
import Layout from 'components/Layout';
import Icon from 'components/Icon';
import {
  PageNotFoundWrapperStyle,
  PageNotFoundMessageWrapperStyle,
  PageNotFoundIconStyle,
  PageNotFoundTitleStyle,
  PageNotFoundDescriptionStyle,
  PageNotFoundGraphicsWrapperStyle,
  PageNotFoundGraphicStyle,
} from './style';

const PageNotFound = () => (
  <UIConsumer>
    {uiState => (
      <Layout {...uiState} navBar={<NavBar />}>
        <div className={PageNotFoundWrapperStyle}>
          <div className={PageNotFoundMessageWrapperStyle}>
            <div className={PageNotFoundIconStyle}>
              <Icon icon="WARNING_TRIANGLE" />
            </div>
            <div className={PageNotFoundTitleStyle}>
              <FormattedMessage
                id="components.pageNotFound.title"
                defaultMessage="PAGE NOT FOUND"
              />
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
      </Layout>
    )}
  </UIConsumer>
);

export default PageNotFound;
