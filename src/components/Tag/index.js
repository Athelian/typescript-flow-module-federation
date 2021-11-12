// @flow
import * as React from 'react';
import { Tooltip } from 'components/Tooltip';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import type { Tag as TagType } from './type.js.flow';
import { TagStyle, PrefixStyle, SuffixStyle, OwnerStyle } from './style';

type OptionalProps = {
  prefix: React.Node,
  suffix: React.Node,
};

type Props = OptionalProps & {
  tag: TagType,
};

const defaultProps = {
  prefix: null,
  suffix: null,
};

const Tag = ({ tag, prefix, suffix }: Props) => {
  const defaultTag = {
    name: '',
    color: '#ffffff',
  };
  const mergedTag = { ...defaultTag, ...tag };
  const { color, name, ownedBy } = mergedTag;
  const { organization } = useUser();

  const tagIsShared = organization?.id !== ownedBy?.id;
  // This is used since tags are in the input
  const popperOptions = {
    modifiers: {
      preventOverflow: { enabled: false },
    },
  };
  const [isVisible, setTooltipVisible] = React.useState(false);
  const [delayHandler, setDelayHandler] = React.useState(null);

  return (
    <div className={TagStyle(color)}>
      <span>
        {tagIsShared && (
          <Tooltip
            visible={isVisible}
            message={
              <>
                <FormattedMessage id="modules.Tags.sharedBy" defaultMessage="sharedBy" />{' '}
                <span>{ownedBy?.name}</span>
              </>
            }
            popperOptions={popperOptions}
          >
            <span
              className={OwnerStyle}
              onMouseEnter={() => {
                // doing it like this because popup doesnt
                // disappear when you scroll down
                setDelayHandler(
                  setTimeout(() => {
                    setTooltipVisible(true);
                  }, 500)
                );
              }}
              onMouseLeave={() => {
                clearTimeout(delayHandler);
                setTooltipVisible(false);
              }}
            >
              {ownedBy?.name.charAt(0)}
            </span>
          </Tooltip>
        )}
        {prefix && <div className={PrefixStyle(color)}>{prefix}</div>}
        {name}
      </span>
      {suffix && <div className={SuffixStyle(color)}>{suffix}</div>}
    </div>
  );
};

Tag.defaultProps = defaultProps;

export default Tag;
