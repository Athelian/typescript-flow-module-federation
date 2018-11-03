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
// containers
import {
  ActionContainer,
  CloneContainer,
  SplitContainer,
  ConnectContainer,
} from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';

type Props = {
  refetch: Function,
};

const getButtonBackground = (currentAction, selectedAction) =>
  currentAction && currentAction === selectedAction ? 'TEAL_DARK' : 'TEAL';

const ActionSubscribe = ({ refetch }: Props) => (
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
          {
            state: { focusMode, targetedItem },
            isTargetTreeMode,
            isTargetMode,
            selectTargetItem,
            reset: cancelTarget,
          },
          { setResult, setAction, state: { currentAction } },
          { clone },
          { split },
          connectContainer
        ) =>
          (isTargetMode() || isTargetTreeMode()) && (
            <>
              <ActionSelector target={targetedItem} onCancelTarget={cancelTarget}>
                {(function renderPanel() {
                  switch (currentAction) {
                    default:
                      return (
                        <>
                          <BaseButton
                            icon="CLONE"
                            label="CLONE"
                            backgroundColor={getButtonBackground(currentAction, 'cloned')}
                            hoverBackgroundColor="TEAL_DARK"
                            onClick={async () => {
                              const [newResult, newFocus] = await clone(
                                client,
                                targetedItem,
                                focusMode
                              );
                              await refetch();
                              setResult(newResult);
                              selectTargetItem(newFocus);
                              setAction('cloned');
                            }}
                          />
                          <BaseButton
                            icon="SPLIT"
                            label="SPLIT"
                            backgroundColor={getButtonBackground(currentAction, 'split')}
                            hoverBackgroundColor="TEAL_DARK"
                            onClick={() => setAction(currentAction !== 'split' ? 'split' : null)}
                          />
                          <BooleanValue>
                            {({ value: opened, set: slideToggle }) => (
                              <>
                                <BaseButton
                                  disabled
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
                                      onSave={() => {}}
                                      onCancel={() => slideToggle(false)}
                                      type="orders"
                                    />
                                  )}
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>
                          <BaseButton
                            disabled
                            icon="CONNECT"
                            label="CONNECT"
                            backgroundColor={getButtonBackground(currentAction, 'connect')}
                            hoverBackgroundColor="TEAL_DARK"
                            onClick={() => setAction('connect')}
                          />
                          <BaseButton
                            icon="REMOVE"
                            label="DELETE"
                            backgroundColor={getButtonBackground(currentAction, 'delete')}
                            hoverBackgroundColor="TEAL_DARK"
                            onClick={() => setAction('delete')}
                          />
                        </>
                      );
                    case 'cloned':
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              cancelTarget();
                              setAction(null);
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
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            cancelTarget();
                            setAction(null);
                          }}
                        >
                          <Label>Cancel</Label>
                        </button>
                      );
                  }
                })()}
              </ActionSelector>
              {currentAction === 'split' && (
                <SplitPanel
                  onApply={async splitData => {
                    const [splitResult, splitFocus] = await split(client, targetedItem, splitData);
                    await refetch();
                    setResult(splitResult);
                    selectTargetItem(splitFocus);
                  }}
                />
              )}
              {currentAction === 'connect' && <ConnectPanel connect={connectContainer} />}
            </>
          )
        }
      </Subscribe>
    )}
  </ApolloConsumer>
);

export default ActionSubscribe;
