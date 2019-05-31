// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import InlineSelectEnumInput from 'modules/relationMap/order/components/TableInlineEdit/components/TableItem/components/InlineSelectEnumInput';
import {
  BatchQuantityHelperWandStyle,
  BatchQuantityHelperWrapperStyle,
  BatchQuantityHelperButtonStyle,
} from './style';

export default function BatchQuantityHelper() {
  return (
    <BooleanValue>
      {({ value: helperIsShown, set: toggleHelperIsShown }) => {
        if (!helperIsShown) {
          return (
            <button
              className={BatchQuantityHelperWandStyle}
              onClick={() => toggleHelperIsShown(true)}
              type="button"
            >
              <Icon icon="MAGIC" />
            </button>
          );
        }

        return (
          <BooleanValue>
            {({ value: changeTypeIsShown, set: toggleChangeTypeIsShown }) => {
              return (
                <OutsideClickHandler
                  onOutsideClick={() => {
                    toggleHelperIsShown(false);
                  }}
                  ignoreClick={!helperIsShown}
                >
                  <div className={BatchQuantityHelperWrapperStyle}>
                    {!changeTypeIsShown ? (
                      <>
                        <button
                          className={BatchQuantityHelperButtonStyle}
                          onClick={() => toggleChangeTypeIsShown(true)}
                          type="button"
                        >
                          <FormattedMessage
                            id="components.button.changeType"
                            defaultMessage="CHANGE TYPE"
                          />
                        </button>

                        <Label align="center">
                          <FormattedMessage id="components.global.or" defaultMessage="OR" />
                        </Label>

                        <button
                          className={BatchQuantityHelperButtonStyle}
                          onClick={() => {
                            console.warn('TODO');
                            toggleHelperIsShown(false);
                          }}
                          type="button"
                        >
                          <FormattedMessage id="components.button.create" defaultMessage="CREATE" />
                        </button>
                      </>
                    ) : (
                      <>
                        <InlineSelectEnumInput
                          id="TODO"
                          name="TODO"
                          value="TODO"
                          enumType="BatchQuantityRevisionType"
                          isRequired
                          width="97.5px"
                          height="22px"
                          forceHoverStyle
                        />

                        <button
                          className={BatchQuantityHelperButtonStyle}
                          onClick={() => {
                            console.warn('TODO');
                            toggleHelperIsShown(false);
                          }}
                          type="button"
                        >
                          <FormattedMessage id="components.button.apply" defaultMessage="APPLY" />
                          <Icon icon="CONFIRM" />
                        </button>
                      </>
                    )}
                  </div>
                </OutsideClickHandler>
              );
            }}
          </BooleanValue>
        );
      }}
    </BooleanValue>
  );
}
