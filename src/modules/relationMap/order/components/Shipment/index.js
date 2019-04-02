// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import usePermission from 'hooks/usePermission';
import { RM_ORDER_FOCUS_MANIPULATE } from 'modules/permission/constants/relationMap';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors, actionCreators } from 'modules/relationMap/order/store';
import ActionCard, { Action } from 'modules/relationMap/common/ActionCard';
import type { ShipmentProps } from 'modules/relationMap/order/type.js.flow';
import { ItemWrapperStyle } from 'modules/relationMap/order/style';
import { ShipmentCard } from 'components/Cards';
import SelectedShipment from './SelectedShipment';
import Badge from '../Badge';

type OptionalProps = {
  wrapperClassName: string,
};

type Props = OptionalProps & ShipmentProps;

const defaultProps = {
  wrapperClassName: ItemWrapperStyle(false),
};

export default function Shipment({ wrapperClassName, id, no, ...shipment }: Props) {
  const context = React.useContext(ActionDispatch);
  const { state, dispatch } = context;
  const { showTag, clone } = state;
  const uiSelectors = selectors(state);
  const actions = actionCreators(dispatch);
  const showCloneBadge = (Object.entries(clone.shipments || {}): Array<any>).some(([, item]) =>
    item.map(({ id: shipmentId }) => shipmentId).includes(id)
  );
  const isNew = uiSelectors.isNewShipment(id);
  const { hasPermission } = usePermission();

  return (
    <BooleanValue>
      {({ value: hovered, set: setToggle }) => (
        <div
          className={wrapperClassName}
          onMouseEnter={() => setToggle(true)}
          onMouseLeave={() => setToggle(false)}
          id={`shipment-${id}`}
        >
          <ShipmentCard
            shipment={showTag ? { ...shipment, id, no } : { ...shipment, id, no, tags: [] }}
            actions={[]}
          />
          {(isNew || showCloneBadge) && <Badge label={showCloneBadge ? 'clone' : 'new'} />}
          {uiSelectors.isAllowToConnectShipment() && state.connectShipment.enableSelectMode ? (
            (() => {
              if (uiSelectors.selectedConnectShipment(id)) {
                return (
                  <ActionCard show>
                    {() => <SelectedShipment onClick={() => actions.toggleSelectedShipment(id)} />}
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
                  {hasPermission(RM_ORDER_FOCUS_MANIPULATE) && (
                    <Action
                      icon="CHECKED"
                      targeted={targeted}
                      toggle={toggle}
                      onClick={() => actions.targetShipmentEntity(id, no)}
                    />
                  )}
                </>
              )}
            </ActionCard>
          )}
        </div>
      )}
    </BooleanValue>
  );
}

Shipment.defaultProps = defaultProps;
