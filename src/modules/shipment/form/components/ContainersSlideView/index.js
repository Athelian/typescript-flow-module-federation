// @flow
import React from 'react';
import { Provider, Subscribe } from 'unstated';
import { earliest, latest } from 'utils/date';
import { Content, SlideViewLayout } from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';
import { resetFormState } from 'modules/form';
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
  onSave: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  onSave: () => {},
};

class ContainersSlideView extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;
    if (onFormReady) onFormReady();
  }

  render() {
    const { onSave } = this.props;
    return (
      <Provider>
        <Subscribe to={[ContainersInSlideViewContainer]}>
          {containersInSlideViewContainer => {
            const {
              state: { containers },
              isDirty,
              setDeepFieldValue,
            } = containersInSlideViewContainer;
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
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="CONTAINER" color="CONTAINER" />
                  {isDirty() && (
                    <>
                      <ResetButton
                        onClick={() => {
                          resetFormState(containersInSlideViewContainer, 'containers');
                        }}
                      />
                      <SaveButton disabled={!isDirty()} onClick={() => onSave(containers)} />
                    </>
                  )}
                </SlideViewNavBar>

                <Content>
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
                </Content>
              </SlideViewLayout>
            );
          }}
        </Subscribe>
      </Provider>
    );
  }
}

export default ContainersSlideView;
