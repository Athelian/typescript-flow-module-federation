// @flow
// FIXME: only use once, should change folder
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import {
  ApproveRejectMenuWrapperStyle,
  ApproveButtonWrapperStyle,
  RejectButtonWrapperStyle,
  ButtonIconStyle,
  ButtonLabelStyle,
} from './style';

type OptionalProps = {
  width: string,
  onApprove: Function,
  onReject: Function,
};

type Props = OptionalProps;

const defaultProps = {
  width: '200px',
  onApprove: () => {},
  onReject: () => {},
};

const ApproveRejectMenu = ({ width, onApprove, onReject }: Props) => (
  <BooleanValue defaultValue>
    {({ value: animationFinished, set: changeAnimationFinished }) => (
      <BooleanValue defaultValue>
        {({ value: approveIsExpanded, set: changeApproveIsExpanded }) => (
          <div className={ApproveRejectMenuWrapperStyle(width)}>
            <button
              className={ApproveButtonWrapperStyle(approveIsExpanded)}
              onMouseEnter={() => {
                if (!approveIsExpanded && animationFinished) {
                  changeAnimationFinished(false);
                  changeApproveIsExpanded(true);
                  setTimeout(() => changeAnimationFinished(true), 300);
                }
              }}
              onClick={evt => {
                evt.stopPropagation();
                onApprove();
              }}
              type="button"
            >
              <div className={ButtonIconStyle}>
                <Icon icon="CHECKED" />
              </div>
              <div className={ButtonLabelStyle}>
                <FormattedMessage id="components.inputs.approve" defaultMessage="APPROVE" />
              </div>
            </button>
            <button
              className={RejectButtonWrapperStyle(approveIsExpanded)}
              onMouseEnter={() => {
                if (approveIsExpanded && animationFinished) {
                  changeAnimationFinished(false);
                  changeApproveIsExpanded(false);
                  setTimeout(() => changeAnimationFinished(true), 300);
                }
              }}
              onClick={evt => {
                evt.stopPropagation();
                onReject();
              }}
              type="button"
            >
              <div className={ButtonLabelStyle}>
                <FormattedMessage id="components.inputs.reject" defaultMessage="REJECT" />
              </div>
              <div className={ButtonIconStyle}>
                <Icon icon="CANCEL" />
              </div>
            </button>
          </div>
        )}
      </BooleanValue>
    )}
  </BooleanValue>
);

ApproveRejectMenu.defaultProps = defaultProps;

export default ApproveRejectMenu;
