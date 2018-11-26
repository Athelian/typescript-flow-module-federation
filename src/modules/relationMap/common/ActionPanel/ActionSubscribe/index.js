// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import logger from 'utils/logger';
// components
import { BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import OutsideClickHandler from 'components/OutsideClickHandler';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
// commons
import TableInlineEdit from 'modules/relationMap/common/TableInlineEdit';
import {
  ActionSelector,
  SplitPanel,
  ConnectPanel,
  ClonePanel,
  ErrorPanel,
  HighlightPanel,
  ConstrainPanel,
} from 'modules/relationMap/common/ActionPanel';
// containers
import {
  ActionContainer,
  CloneContainer,
  SplitContainer,
  ConnectContainer,
} from 'modules/relationMap/containers';
import RelationMapContainer from 'modules/relationMap/container';
import messages from 'modules/relationMap/messages';
import { TabItemStyled, LoadingContainerStyle } from './style';

type Props = {
  filter: Object,
};

type LoadingProps = {
  type: string,
};

const LoadingMessage = ({ type }: LoadingProps) => {
  switch (type) {
    default:
      return null;
    case 'clone':
      return <FormattedMessage {...messages.cloning} />;
    case 'split':
      return <FormattedMessage {...messages.spliting} />;
    case 'connect':
      return <FormattedMessage {...messages.connecting} />;
  }
};

const isSelectSomeItem = targetedItem => {
  const { orderItem = {}, batch = {} } = targetedItem;
  const numberOfOrderItem = Object.keys(orderItem).length;
  const numberOfBatch = Object.keys(batch).length;
  const selectSomeItem = numberOfOrderItem > 0 || numberOfBatch > 0;
  return selectSomeItem;
};

const isDisabledSplit = targetedItem => {
  const { orderItem = {}, batch = {} } = targetedItem;
  const numberOfOrderItem = Object.keys(orderItem).length;
  const numberOfBatch = Object.keys(batch).length;
  const selectSomeItem = numberOfOrderItem > 0 || numberOfBatch > 0;
  const selctedOrderItem = numberOfOrderItem === 1 && numberOfBatch === 0;
  const selectedBatch = numberOfBatch === 1 && numberOfOrderItem === 0;
  if (selectSomeItem && (selctedOrderItem || selectedBatch)) {
    return false;
  }
  return true;
};

const ActionSubscribe = ({ filter }: Props) => (
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
            state: { focusedItem, focusMode, targetedItem },
            isTargetAnyItem,
            isHighlighted,
            resetFocusedItem,
            selectTargetItem,
            // overrideState: setRelationState,
            addNewResult,
            cancelTarget,
          },
          {
            actionFunc,
            setResult,
            setAction,
            setLoading,
            setCurrentAction,
            setError,
            overrideState: setActionState,
            state: { currentAction, loading, error },
          },
          { clone },
          { split },
          connectContainer
        ) => {
          const onClickClone = () => {
            const action = async () => {
              setLoading(true);
              try {
                const [newResult, newFocus] = await clone({
                  client,
                  target: targetedItem,
                  focusMode,
                  filter,
                });
                // setRelationState({
                //   targetedItem: newFocus,
                //   tress: [],
                //   lines: {},
                // });
                addNewResult(newResult, newFocus);
                setActionState({
                  result: newResult,
                  action: '',
                  loading: false,
                  error: false,
                });
              } catch (err) {
                setLoading(false);
                setError(!!err);
                logger.error(err);
              }
            };
            setCurrentAction(action);
            action();
          };
          const onClickSplit = splitData => {
            const action = async () => {
              try {
                setLoading(true);
                const [splitResult, splitFocus] = await split(client, targetedItem, splitData);
                setResult(splitResult);
                selectTargetItem(splitFocus);
                setLoading(false);
                if (error) {
                  setError(false);
                }
              } catch (err) {
                setLoading(false);
                setError(!!err);
              }
            };
            setCurrentAction(action);
            action();
          };
          const onCancelTarget = () => {
            cancelTarget();
            setAction('');
            setError(false);
          };
          const disabledSplit = isDisabledSplit(targetedItem);
          return (
            <>
              {isTargetAnyItem() && (
                <>
                  <ActionSelector target={targetedItem} onCancelTarget={onCancelTarget}>
                    <>
                      <TabItem
                        className={TabItemStyled}
                        label="CLONE"
                        icon="CLONE"
                        active={currentAction === 'clone'}
                        onClick={() => setAction(currentAction !== 'clone' ? 'clone' : null)}
                      />
                      <TabItem
                        className={TabItemStyled}
                        label="SPLIT"
                        icon="SPLIT"
                        disabled={disabledSplit}
                        active={currentAction === 'split'}
                        onClick={() => setAction(currentAction !== 'split' ? 'split' : null)}
                      />
                      <TabItem
                        className={TabItemStyled}
                        label="CONNECT"
                        icon="CONNECT"
                        active={currentAction === 'connect'}
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
                  </ActionSelector>
                  {!error && currentAction === 'clone' && <ClonePanel onClick={onClickClone} />}
                  {!error && !disabledSplit && currentAction === 'split' && (
                    <SplitPanel targetedItem={targetedItem} onApply={onClickSplit} />
                  )}
                  {!error && currentAction === 'connect' && (
                    <ConnectPanel connect={connectContainer} targetedItem={targetedItem} />
                  )}
                  {isSelectSomeItem(targetedItem) && disabledSplit && currentAction !== 'split' && (
                    <ConstrainPanel type="split" />
                  )}
                  {error && (
                    <ErrorPanel onClickCancel={onCancelTarget} onClickRefresh={actionFunc} />
                  )}
                  <OutsideClickHandler ignoreClick onOutsideClick={() => {}}>
                    <Dialog isOpen={loading} options={{ width: 300 }} onRequestClose={() => {}}>
                      <div className={LoadingContainerStyle}>
                        <LoadingIcon />
                        <Label align="center">
                          <LoadingMessage type={currentAction} />
                        </Label>
                        <Label align="center">
                          <FormattedMessage {...messages.waiting} />
                        </Label>
                      </div>
                    </Dialog>
                  </OutsideClickHandler>
                </>
              )}
              {isHighlighted() && <HighlightPanel item={focusedItem} onCancel={resetFocusedItem} />}
            </>
          );
        }}
      </Subscribe>
    )}
  </ApolloConsumer>
);

export default ActionSubscribe;
