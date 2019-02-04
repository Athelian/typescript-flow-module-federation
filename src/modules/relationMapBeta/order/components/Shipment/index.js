// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { selectors, actionCreators } from 'modules/relationMapBeta/order/store';
import BaseCard, { ShipmentCard } from 'components/Cards';
import { WrapperCard } from 'components/RelationMap';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import type { ShipmentProps } from 'modules/relationMapBeta/order/type.js.flow';
import { ItemWrapperStyle } from 'modules/relationMap/common/RelationItem/style';
import SelectedShipment from './SelectedShipment';

type OptionalProps = {
  wrapperClassName: string,
};

type Props = OptionalProps & ShipmentProps;

const defaultProps = {
  wrapperClassName: ItemWrapperStyle(false),
};

export default function Shipment({ wrapperClassName, id, tags, ...shipment }: Props) {
  const context = React.useContext(ActionDispatch);
  const { state, dispatch } = context;
  const { showTag } = state;
  const uiSelectors = selectors(state);
  const actions = actionCreators(dispatch);
  return (
    <BaseCard id={`shipment-${id}`} wrapperClassName={wrapperClassName}>
      <BooleanValue>
        {({ value: hovered, set: setToggle }) => (
          <WrapperCard onMouseEnter={() => setToggle(true)} onMouseLeave={() => setToggle(false)}>
            {/* Send empty array for tags for hidden tags on shipment card when hidden tags */}
            <ShipmentCard shipment={showTag ? shipment : { ...shipment, tags: [] }} actions={[]} />
            {uiSelectors.isAllowToConnectShipment() && state.connectShipment.enableSelectMode ? (
              (() => {
                if (uiSelectors.selectedConnectShipment(id)) {
                  return (
                    <ActionCard show>
                      {() => (
                        <SelectedShipment onClick={() => actions.toggleSelectedShipment(id)} />
                      )}
                    </ActionCard>
                  );
                }
                return (
                  <ActionCard show={hovered}>
                    {() => (
                      <Action icon="CHECKED" onClick={() => actions.toggleSelectedShipment(id)} />
                    )}
                  </ActionCard>
                );
              })()
            ) : (
              <ActionCard show={hovered}>
                {({ targeted, toggle }) => (
                  <>
                    <Action
                      icon="MAGIC"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.toggleHighLight('SHIPMENT', id)}
                    />
                    <Action
                      icon="DOCUMENT"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.showEditForm('SHIPMENT', id)}
                    />
                    <Action
                      icon="CHECKED"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.targetShipmentEntity(id)}
                    />
                  </>
                )}
              </ActionCard>
            )}
          </WrapperCard>
        )}
      </BooleanValue>
    </BaseCard>
  );
}

Shipment.defaultProps = defaultProps;
