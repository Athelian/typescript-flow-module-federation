// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import BaseCard from 'components/Cards';
import { BatchCard, WrapperCard, Tags } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import type { BatchProps } from 'modules/relationMapBeta/order/type.js.flow';

type OptionalProps = {
  wrapperClassName?: string,
};

type Props = OptionalProps & BatchProps;

export default function Batch({ wrapperClassName, tags, ...batch }: Props) {
  const context = React.useContext(ActionDispatch);
  const {
    state: { showTag },
  } = context;
  return (
    <BaseCard showActionsOnHover icon="BATCH" color="BATCH" wrapperClassName={wrapperClassName}>
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            <BatchCard batch={batch} />
            <ActionCard show={hovered}>
              {({ targetted, toggle }) => (
                <>
                  <Action
                    icon="MAGIC"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('HIGHLIGHT')}
                  />
                  <Action
                    icon="DOCUMENT"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('EDIT')}
                  />
                  <Action
                    icon="CHECKED"
                    targetted={targetted}
                    toggle={toggle}
                    onClick={() => console.warn('TARGET')}
                  />
                </>
              )}
            </ActionCard>
            {showTag && <Tags dataSource={tags} />}
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}
