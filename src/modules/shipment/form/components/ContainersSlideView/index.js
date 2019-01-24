// @flow
import React from 'react';

import { Subscribe } from 'unstated';
import { isNullOrUndefined, isEquals } from 'utils/fp';
import { earliest, latest } from 'utils/date';

import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { ShipmentContainerCard } from 'components/Cards';

import { ContainersFormContainer } from 'modules/shipment/form/containers';
import Summary from './components/Summary';

type OptionalProps = {
  containers: Array<Object>,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSave: Function,
  onFormReady: Function,
};

class ContainersSlideView extends React.Component<Props> {
  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { containers } = this.props;
    return !isEquals(containers, nextProps.containers);
  }

  render() {
    const { containers, onCancel, onSave } = this.props;

    const agreedArrivalDates = containers
      .map(({ warehouseArrivalAgreedDate }) => warehouseArrivalAgreedDate)
      .filter(item => !isNullOrUndefined(item))
      .map(item => new Date(item));

    const actualArrivalDates = containers
      .map(({ warehouseArrivalActualDate }) => warehouseArrivalActualDate)
      .filter(item => !isNullOrUndefined(item))
      .map(item => new Date(item));

    return (
      <Subscribe to={[ContainersFormContainer]}>
        {({ originalValues, state, isDirty, setDeepFieldValue }) => {
          const values = {
            ...originalValues,
            ...state,
          };

          return (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="CONTAINER" color="CONTAINER" />
                  <CancelButton onClick={onCancel} />
                  <SaveButton disabled={!isDirty()} onClick={() => onSave(values.containers)} />
                </SlideViewNavBar>
              }
            >
              <Summary
                agreedArrivalDateFrom={earliest(agreedArrivalDates)}
                agreedArrivalDateTo={latest(agreedArrivalDates)}
                actualArrivalDateFrom={earliest(actualArrivalDates)}
                actualArrivalDateTo={latest(actualArrivalDates)}
                containers={containers}
                approvedAgreementSize={agreedArrivalDates.length}
                approvedConfirmationSize={actualArrivalDates.length}
              />
              <div>
                {containers.map((container, index) => (
                  <ShipmentContainerCard
                    key={container.id}
                    container={container}
                    update={newContainer => {
                      setDeepFieldValue(`containers.${index}`, newContainer);
                    }}
                  />
                ))}
              </div>
            </Layout>
          );
        }}
      </Subscribe>
    );
  }
}

export default ContainersSlideView;
