// @flow
import React from 'react';
import { Provider, Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { PermissionConsumer } from 'modules/permission';
import { SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import { earliest, latest } from 'utils/date';
import Layout from 'components/Layout';
import SlideView from 'components/SlideView';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { ShipmentContainerCard } from 'components/Cards';
import {
  getAgreedArrivalDates,
  getActualArrivalDates,
  numAgreedArrivalDateApproved,
  numActualArrivalDateApproved,
} from 'modules/shipment/helpers';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import { ContainersInSlideViewContainer } from 'modules/shipment/form/containers';
import ContainersSummaryNavbar from './ContainersSummaryNavbar';
import { GridViewWrapperStyle } from './style';

type OptionalProps = {
  onFormReady?: Function,
  onCancel: Function,
  onSave: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  onCancel: () => {},
  onSave: () => {},
};

class ContainersSlideView extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  render() {
    const { onCancel, onSave } = this.props;

    return (
      <PermissionConsumer>
        {hasPermission => {
          const allowUpdate = hasPermission(SHIPMENT_UPDATE);

          return (
            <Provider>
              <Subscribe to={[ContainersInSlideViewContainer]}>
                {({ state: { containers }, isDirty, setDeepFieldValue }) => {
                  const agreedArrivalDates = getAgreedArrivalDates(containers);
                  const actualArrivalDates = getActualArrivalDates(containers);
                  const agreedArrivalDateFrom = earliest(agreedArrivalDates);
                  const agreedArrivalDateTo = latest(agreedArrivalDates);
                  const actualArrivalDateFrom = earliest(actualArrivalDates);
                  const actualArrivalDateTo = latest(actualArrivalDates);
                  const numOfContainers = containers.length;
                  const numOfApprovedAgreed = numAgreedArrivalDateApproved(containers);
                  const numOfApprovedActual = numActualArrivalDateApproved(containers);
                  return (
                    <Layout
                      navBar={
                        <SlideViewNavBar>
                          <EntityIcon icon="CONTAINER" color="CONTAINER" />
                          <CancelButton onClick={onCancel} />
                          <SaveButton disabled={!isDirty()} onClick={() => onSave(containers)} />
                        </SlideViewNavBar>
                      }
                    >
                      <ContainersSummaryNavbar
                        agreedArrivalDateFrom={agreedArrivalDateFrom}
                        agreedArrivalDateTo={agreedArrivalDateTo}
                        actualArrivalDateFrom={actualArrivalDateFrom}
                        actualArrivalDateTo={actualArrivalDateTo}
                        numOfContainers={numOfContainers}
                        numOfApprovedAgreed={numOfApprovedAgreed}
                        numOfApprovedActual={numOfApprovedActual}
                      />

                      <div className={GridViewWrapperStyle}>
                        {containers.map((container, index) => (
                          <BooleanValue key={container.id}>
                            {({ value: isOpenSelectWarehouse, set: toggleSelectWarehouse }) => (
                              <>
                                <ShipmentContainerCard
                                  container={container}
                                  update={newContainer => {
                                    setDeepFieldValue(`containers.${index}`, newContainer);
                                  }}
                                  onSelectWarehouse={() => toggleSelectWarehouse(true)}
                                  readOnly={!allowUpdate}
                                />
                                <SlideView
                                  isOpen={isOpenSelectWarehouse}
                                  onRequestClose={() => toggleSelectWarehouse(false)}
                                  options={{ width: '1030px' }}
                                >
                                  {isOpenSelectWarehouse && (
                                    <SelectWareHouse
                                      selected={container.warehouse}
                                      onCancel={() => toggleSelectWarehouse(false)}
                                      onSelect={newValue => {
                                        toggleSelectWarehouse(false);
                                        setDeepFieldValue(`containers.${index}`, {
                                          ...container,
                                          warehouse: newValue,
                                        });
                                      }}
                                    />
                                  )}
                                </SlideView>
                              </>
                            )}
                          </BooleanValue>
                        ))}
                      </div>
                    </Layout>
                  );
                }}
              </Subscribe>
            </Provider>
          );
        }}
      </PermissionConsumer>
    );
  }
}

export default ContainersSlideView;
