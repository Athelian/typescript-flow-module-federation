// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Tag from 'components/Tag';
import { Tooltip } from 'components/Tooltip';
import { MessageContainerStyle, OverflowStyle, TagContainerStyle } from './style';
import messages from './messages';

type Props = {
  integratedTags: Object,
};

function IntegratedTagTooltip({ integratedTags }: Props) {
  const [isVisible, setTooltipVisible] = React.useState(false);
  const [delayHandler, setDelayHandler] = React.useState(null);
  const { totalTags, totalOwners } = React.useMemo(() => {
    const organizationIds = Object.keys(integratedTags).reduce((arr, tagId) => {
      arr.push(integratedTags[tagId].ownedBy.id);
      return arr;
    }, []);
    return {
      totalTags: Object.keys(integratedTags).length,
      totalOwners: [...new Set(organizationIds)].length,
    };
  }, [integratedTags]);

  return (
    <Tooltip
      visible={isVisible}
      message={
        <div className={MessageContainerStyle}>
          <div>
            <FormattedMessage {...messages.totalShared} values={{ totalTags, totalOwners }} />
          </div>
          <div className={TagContainerStyle}>
            {Object.keys(integratedTags ?? {}).map(integratedTagId => {
              return <Tag key={integratedTagId} tag={integratedTags[integratedTagId]} />;
            })}
          </div>
        </div>
      }
      popperOptions={{
        modifiers: {
          preventOverflow: { enabled: false },
        },
      }}
    >
      <span
        className={OverflowStyle}
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
        +{Object.keys(integratedTags).length}
      </span>
    </Tooltip>
  );
}

export default IntegratedTagTooltip;
