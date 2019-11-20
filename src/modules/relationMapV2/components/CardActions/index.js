// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from 'components/Icon';
import usePortalSlot from 'hooks/usePortalSlot';
import OutsideClickHandler from 'components/OutsideClickHandler';
import {
  CardActionsWrapperStyle,
  CardActionsButtonStyle,
  DropdownWrapperStyle,
  OptionStyle,
} from './style';

type Props = {|
  actions?: Array<{
    label: React.Node,
    onClick: Function,
  }>,
|};

export default function CardActions({ actions = [] }: Props) {
  const slot = usePortalSlot();
  const companionRef = React.useRef<HTMLDivElement | null>(null);
  const optionsRef = React.useRef<HTMLDivElement | null>(null);

  const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!dropdownIsOpen || !companionRef.current || !optionsRef.current) {
      return;
    }

    const viewportOffset: ClientRect = companionRef.current.getBoundingClientRect();

    // $FlowFixMe
    optionsRef.current.style.top = `${viewportOffset.top + viewportOffset.height + 5}px`;
    // $FlowFixMe
    optionsRef.current.style.right = `${window.innerWidth - viewportOffset.right}px`;
  }, [companionRef, optionsRef, dropdownIsOpen]);

  React.useEffect(() => {
    const opts = { capture: false, passive: true };
    const listener: WheelEventHandler = e => {
      // $FlowFixMe
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setDropdownIsOpen(false);
      }
    };

    document.addEventListener('wheel', listener, opts);
    return () => document.removeEventListener('wheel', listener, opts);
  }, [setDropdownIsOpen]);

  return (
    actions.length > 0 && (
      <div className={CardActionsWrapperStyle}>
        <button
          ref={companionRef}
          onClick={event => {
            event.stopPropagation();
            setDropdownIsOpen(!dropdownIsOpen);
          }}
          className={CardActionsButtonStyle(dropdownIsOpen)}
          type="button"
        >
          <Icon icon="HORIZONTAL_ELLIPSIS" />
        </button>

        {dropdownIsOpen &&
          ReactDOM.createPortal(
            <OutsideClickHandler
              onOutsideClick={() => setDropdownIsOpen(false)}
              ignoreClick={!dropdownIsOpen}
            >
              <div
                className={DropdownWrapperStyle(actions.length)}
                ref={ref => {
                  optionsRef.current = ref;
                }}
              >
                {actions.map((action, index) => {
                  const { label, onClick } = action;

                  return (
                    <button
                      key={String(index)}
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
            </OutsideClickHandler>,
            slot
          )}
      </div>
    )
  );
}
