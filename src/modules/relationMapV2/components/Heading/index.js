// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Display, Label } from 'components/Form';
import FilterHitBorder from 'modules/relationMapV2/components/FilterHitBorder';
import {
  HeadingWrapperStyle,
  LeftWrapperStyle,
  TotalWrapperStyle,
  SelectAllButtonStyle,
  ExpandedIconWrapperStyle,
  ItemHeadingSelectedStyle,
} from './style';

type Props = {|
  width: string,
  hasSelectedChildren: boolean,
  hasFilterHits: boolean,
  isExpanded: boolean,
  onClick: Function,
  total: number,
  onSelectAll: Function,
  renderRightSide: Function,
|};

export default function Heading({
  width,
  hasSelectedChildren,
  hasFilterHits,
  isExpanded,
  onClick,
  total,
  onSelectAll,
  renderRightSide,
}: Props) {
  // TODO: Replace with real permissions
  const allowToSelectOrUnselectAll = true;
  const canViewTotal = true;

  // TODO: Replace with real numbers
  const selectedItemsCount = 0;

  return (
    <div className={HeadingWrapperStyle(isExpanded, width)} onClick={onClick} role="presentation">
      <div className={LeftWrapperStyle}>
        <div className={TotalWrapperStyle}>
          <Label width="55px">
            <FormattedMessage id="components.button.total" defaultMessage="TOTAL" />
          </Label>
          <Display width="70px" blackout={!canViewTotal}>
            <FormattedNumber value={total} />
          </Display>
        </div>

        {allowToSelectOrUnselectAll && (
          <button
            onClick={event => {
              event.stopPropagation();
              onSelectAll();
            }}
            className={SelectAllButtonStyle}
            type="button"
          >
            <Label>
              {selectedItemsCount === total ? (
                <FormattedMessage
                  id="components.button.unselectAll"
                  defaultMessage="UNSELECT ALL"
                />
              ) : (
                <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
              )}
            </Label>
            <Icon icon="CHECKED" />
          </button>
        )}
      </div>

      {renderRightSide()}

      <div className={ExpandedIconWrapperStyle(isExpanded)}>
        <Icon icon="CHEVRON_DOWN" />
      </div>

      <span className={ExpandedIconWrapperStyle(isExpanded)}>
        <Icon icon="CHEVRON_DOWN" />
      </span>

      <FilterHitBorder hasFilterHits={!isExpanded && hasFilterHits} />

      <div className={ItemHeadingSelectedStyle(!isExpanded && hasSelectedChildren)} />
    </div>
  );
}
