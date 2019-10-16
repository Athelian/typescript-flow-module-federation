// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import {
  CardActionsWrapperStyle,
  CardActionsButtonStyle,
  DropdownWrapperStyle,
  OptionStyle,
} from './style';

type Props = {|
  actions: Array<{
    label: React.Node,
    onClick: Function,
  }>,
|};

export default function CardActions({ actions = [] }: Props) {
  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);

  return (
    actions.length > 0 && (
      <OutsideClickHandler
        onOutsideClick={() => setDropdownIsOpen(false)}
        ignoreClick={!dropdownIsOpen}
      >
        <div className={CardActionsWrapperStyle}>
          <button
            onClick={event => {
              event.stopPropagation();
              setDropdownIsOpen(!dropdownIsOpen);
            }}
            className={CardActionsButtonStyle(dropdownIsOpen)}
            type="button"
          >
            <Icon icon="HORIZONTAL_ELLIPSIS" />
          </button>

          <div className={DropdownWrapperStyle(dropdownIsOpen, actions.length)}>
            {actions.map(action => {
              const { label, onClick } = action;

              return (
                <button
                  className={OptionStyle}
                  onClick={event => {
                    onClick(event);
                    setDropdownIsOpen(false);
                  }}
                  type="button"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </OutsideClickHandler>
    )
  );
}
