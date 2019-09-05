// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import logger from 'utils/logger';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import ActionButton from './components/ActionButton';
import ActionSubMenu from './components/ActionSubMenu';
import ActionLabel from './components/ActionLabel';
import { ActionsWrapperStyle } from './style';

type Props = {
  targets: Array<string>,
};

function getEntityCount(targets: Array<string>, entityConstant: string) {
  return targets.filter(item => item.includes(`${entityConstant}-`)).length;
}

export default function Actions({ targets }: Props) {
  const [currentMenu, setCurrentMenu] = React.useState(null);
  const { dispatch } = React.useContext(RelationMapContext);
  const orderIsDisabled = getEntityCount(targets, ORDER) === 0;
  const itemIsDisabled = getEntityCount(targets, ORDER_ITEM) === 0;
  const batchIsDisabled = getEntityCount(targets, BATCH) === 0;
  const containerIsDisabled = getEntityCount(targets, CONTAINER) === 0;
  const shipmentIsDisabled = getEntityCount(targets, SHIPMENT) === 0;

  return (
    <OutsideClickHandler
      onOutsideClick={() => setCurrentMenu(null)}
      ignoreClick={currentMenu === null}
    >
      <div className={ActionsWrapperStyle}>
        <ActionButton
          isDisabled={orderIsDisabled}
          onClick={() => {
            if (currentMenu === ORDER) setCurrentMenu(null);
            else setCurrentMenu(ORDER);
          }}
        >
          <Icon icon="ORDER" />
          <ActionSubMenu isCollapsed={currentMenu !== ORDER}>
            <ActionButton
              onClick={() => {
                logger.warn('CLONE');
                dispatch({
                  type: 'CLONE',
                  payload: {
                    source: ORDER,
                  },
                });
              }}
            >
              <Icon icon="CLONE" />
              <ActionLabel>CLONE</ActionLabel>
            </ActionButton>

            <ActionButton onClick={() => logger.warn('ADD TAGS')}>
              <Icon icon="TAG" />
              <ActionLabel>ADD TAGS</ActionLabel>
            </ActionButton>
          </ActionSubMenu>
        </ActionButton>

        <ActionButton
          isDisabled={itemIsDisabled}
          onClick={() => {
            if (currentMenu === ORDER_ITEM) setCurrentMenu(null);
            else setCurrentMenu(ORDER_ITEM);
          }}
        >
          <Icon icon="ORDER_ITEM" />
          <ActionSubMenu isCollapsed={currentMenu !== ORDER_ITEM}>
            <ActionButton
              onClick={() => {
                logger.warn('CLONE');
                dispatch({
                  type: 'CLONE',
                  payload: {
                    source: ORDER_ITEM,
                  },
                });
              }}
            >
              <Icon icon="CLONE" />
              <ActionLabel>CLONE</ActionLabel>
            </ActionButton>

            <ActionButton onClick={() => logger.warn('ADD TAGS')}>
              <Icon icon="TAG" />
              <ActionLabel>ADD TAGS</ActionLabel>
            </ActionButton>
          </ActionSubMenu>
        </ActionButton>

        <ActionButton
          isDisabled={batchIsDisabled}
          onClick={() => {
            if (currentMenu === BATCH) setCurrentMenu(null);
            else setCurrentMenu(BATCH);
          }}
        >
          <Icon icon="BATCH" />
          <ActionSubMenu isCollapsed={currentMenu !== BATCH}>
            <ActionButton
              onClick={() => {
                logger.warn('CLONE');
                dispatch({
                  type: 'CLONE',
                  payload: {
                    source: BATCH,
                  },
                });
              }}
            >
              <Icon icon="CLONE" />
              <ActionLabel>CLONE</ActionLabel>
            </ActionButton>

            <ActionButton onClick={() => logger.warn('ADD TAGS')}>
              <Icon icon="TAG" />
              <ActionLabel>ADD TAGS</ActionLabel>
            </ActionButton>
          </ActionSubMenu>
        </ActionButton>

        <ActionButton
          isDisabled={containerIsDisabled}
          onClick={() => {
            if (currentMenu === CONTAINER) setCurrentMenu(null);
            else setCurrentMenu(CONTAINER);
          }}
        >
          <Icon icon="CONTAINER" />
        </ActionButton>

        <ActionButton
          isDisabled={shipmentIsDisabled}
          onClick={() => {
            if (currentMenu === SHIPMENT) setCurrentMenu(null);
            else setCurrentMenu(SHIPMENT);
          }}
        >
          <Icon icon="SHIPMENT" />
        </ActionButton>
      </div>
    </OutsideClickHandler>
  );
}
