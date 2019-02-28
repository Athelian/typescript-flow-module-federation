// @flow
import React from 'react';
import { Provider, Subscribe } from 'unstated';
import { earliest, latest } from 'utils/date';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  getAgreedArrivalDates,
  getActualArrivalDates,
  numAgreedArrivalDateApproved,
  numActualArrivalDateApproved,
} from 'modules/shipment/helpers';
import { ContainersInSlideViewContainer } from 'modules/shipment/form/containers';
import ContainersSummaryNavbar from './ContainersSummaryNavbar';
import ContainerList from './ContainerList';

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

                <ContainerList containers={containers} setDeepFieldValue={setDeepFieldValue} />
              </Layout>
            );
          }}
        </Subscribe>
      </Provider>
    );
  }
}

export default ContainersSlideView;
