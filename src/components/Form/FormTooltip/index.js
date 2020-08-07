// @flow
import * as React from 'react';
import { isEquals } from 'utils/fp';
import { isValidDate } from 'utils/date';
import FormattedDate from 'components/FormattedDate';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import TooltipIcon from './TooltipIcon';
import {
  TooltipRelativeWrapperStyle,
  UpperMessageStyle,
  OldValueStyle,
  NewValueStyle,
  ArrowDownStyle,
  InfoMessageStyle,
  DividerStyle,
} from './style';

type OptionalProps = {
  isNew: boolean,
  errorMessage: React.Node,
  warningMessage: React.Node,
  infoMessage: React.Node,
  changedValues: {
    oldValue: React.Node,
    newValue: React.Node,
  },
};

type Props = OptionalProps;

const defaultProps = {
  isNew: false,
  errorMessage: '',
  warningMessage: '',
  infoMessage: '',
  changedValues: {
    oldValue: '',
    newValue: '',
  },
};

export default function FormTooltip({
  isNew,
  errorMessage,
  warningMessage,
  infoMessage,
  changedValues,
}: Props) {
  const { oldValue, newValue } = changedValues;

  let type = null;
  const showChanged = !isNew && (!!oldValue || !!newValue) && !isEquals(oldValue, newValue);

  if (errorMessage) type = 'error';
  else if (warningMessage) type = 'warning';
  else if (showChanged) type = 'changed';
  else if (infoMessage) type = 'info';

  if (type) {
    return (
      <div className={TooltipRelativeWrapperStyle}>
        <Tooltip
          message={
            <>
              {errorMessage && (
                <>
                  <div className={UpperMessageStyle}>{errorMessage}</div>
                  {(warningMessage || changedValues.oldValue || infoMessage) && (
                    <div className={DividerStyle} />
                  )}
                </>
              )}

              {warningMessage && (
                <>
                  <div className={UpperMessageStyle}>{warningMessage}</div>
                  {(changedValues.oldValue || infoMessage) && <div className={DividerStyle} />}
                </>
              )}

              {showChanged && (
                <>
                  <div className={OldValueStyle}>
                    {isValidDate(changedValues.oldValue) ? (
                      <FormattedDate value={changedValues.oldValue || ''} />
                    ) : (
                      changedValues.oldValue
                    )}
                  </div>
                  <div className={ArrowDownStyle}>
                    <Icon icon="ARROW_DOWN" />
                  </div>
                  <div className={NewValueStyle}>
                    {isValidDate(changedValues.newValue) ? (
                      <FormattedDate value={changedValues.newValue || ''} />
                    ) : (
                      changedValues.newValue
                    )}
                  </div>
                  {infoMessage && <div className={DividerStyle} />}
                </>
              )}

              {infoMessage && <div className={InfoMessageStyle}>{infoMessage}</div>}
            </>
          }
        >
          <TooltipIcon type={type} hasInfo={!!infoMessage} />
        </Tooltip>
      </div>
    );
  }
  return null;
}

FormTooltip.defaultProps = defaultProps;
