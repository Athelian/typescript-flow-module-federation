// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { ApolloConsumer } from 'react-apollo';
// components
import { BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { Label } from 'components/Form';
// commons
import TableInlineEdit from 'modules/relationMap/common/TableInlineEdit';
import { ActionSelector, SplitPanel, ConnectPanel } from 'modules/relationMap/common/ActionPanel';
import logger from 'utils/logger';
// containers
import {
  ActionContainer,
  CloneContainer,
  SplitContainer,
  ConnectContainer,
} from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import { TabItemStyled } from './style';

// type Props = {
//   refetch: Function,
//   filter: Object,
// };

const isDisabledSplit = targetedItem => {
  const { orderItem = {}, batch = {} } = targetedItem;
  const numberOfOrderItem = Object.keys(orderItem).length;
  const numberOfBatch = Object.keys(batch).length;
  if (numberOfOrderItem === 1 && numberOfBatch === 0) {
    return false;
  }
  if (numberOfBatch === 1 && numberOfOrderItem === 0) {
    return false;
  }
  return true;
};

const ActionSubscribe = () => (
  <ApolloConsumer>
    {client => (
      <Subscribe
        to={[
          RelationMapContainer,
          ActionContainer,
          CloneContainer,
          SplitContainer,
          ConnectContainer,
        ]}
      >
        {(
          { state: { focusMode, targetedItem }, isTargetAnyItem, selectTargetItem, cancelTarget },
          { setResult, setAction, state: { currentAction } },
          { clone },
          { split },
          connectContainer
        ) => {
          logger.warn('currentAction', currentAction);

          const renderActionSelector = (actionKey: ?string) => (
            <>
              <TabItem
                className={TabItemStyled}
                label="CLONE"
                icon="CLONE"
                active={actionKey === 'clone'}
                onClick={async () => {
                  const [newResult, newFocus] = await clone({
                    client,
                    target: targetedItem,
                    focusMode,
                  });
                  // await refetch();
                  setResult(newResult);
                  selectTargetItem(newFocus);
                  setAction('cloned');
                }}
              />
              <TabItem
                className={TabItemStyled}
                label="SPLIT"
                icon="SPLIT"
                disabled={isDisabledSplit(targetedItem)}
                active={actionKey === 'split'}
                onClick={() => setAction(currentAction !== 'split' ? 'split' : null)}
              />
              <TabItem
                className={TabItemStyled}
                label="CONNECT"
                icon="CONNECT"
                active={actionKey === 'connect'}
                onClick={() => setAction('connect')}
              />
              <BooleanValue>
                {({ value: opened, set: slideToggle }) => (
                  <>
                    <BaseButton
                      icon="EDIT"
                      label="EDIT"
                      backgroundColor="TEAL"
                      hoverBackgroundColor="TEAL_DARK"
                      onClick={() => slideToggle(true)}
                    />
                    <SlideView
                      isOpen={opened}
                      onRequestClose={() => slideToggle(false)}
                      options={{ width: '1030px' }}
                    >
                      {opened && (
                        <TableInlineEdit
                          selected={targetedItem}
                          onExpand={() => {}}
                          onSave={() => {}}
                          onCancel={() => slideToggle(false)}
                          type="orders"
                        />
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>
            </>
          );

          return (
            isTargetAnyItem() && (
              <>
                <ActionSelector
                  target={targetedItem}
                  onCancelTarget={() => {
                    cancelTarget();
                    setAction('');
                  }}
                >
                  {(function renderPanel() {
                    switch (currentAction) {
                      default:
                        return renderActionSelector();
                      case 'split':
                        return renderActionSelector('split');
                      case 'cloned':
                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                cancelTarget();
                                setAction('');
                              }}
                            >
                              <Label>Clear All</Label>
                            </button>
                            <BaseButton
                              icon="CHECKED"
                              label="SELECTED ALL CLONE"
                              backgroundColor="TEAL_DARK"
                              hoverBackgroundColor="TEAL_DARK"
                            />
                          </>
                        );
                      case 'connect':
                        return renderActionSelector('connect');
                    }
                  })()}
                </ActionSelector>
                {currentAction === 'split' && (
                  <SplitPanel
                    targetedItem={targetedItem}
                    onApply={async splitData => {
                      const [splitResult, splitFocus] = await split(
                        client,
                        targetedItem,
                        splitData
                      );
                      // await refetch();
                      setResult(splitResult);
                      selectTargetItem(splitFocus);
                    }}
                  />
                )}
                {currentAction === 'connect' && (
                  <ConnectPanel connect={connectContainer} targetedItem={targetedItem} />
                )}
              </>
            )
          );
        }}
      </Subscribe>
    )}
  </ApolloConsumer>
);

export default ActionSubscribe;
