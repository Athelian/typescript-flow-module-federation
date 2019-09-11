// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { isEquals } from 'utils/fp';
import ContainerForm from 'modules/container/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import { SaveButton, ResetButton } from 'components/Buttons';
import {
  ContainerInfoContainer,
  ContainerBatchesContainer,
} from 'modules/container/form/containers';
import validator from 'modules/container/form/validator';

type Props = {
  container: Object,
  onSave: Function,
};

const formContainer = new FormContainer();
const infoContainer = new ContainerInfoContainer();
const batchesContainer = new ContainerBatchesContainer();

class ContainerFormInSlide extends React.Component<Props> {
  componentDidMount() {
    const { container } = this.props;
    const { batches = [], representativeBatch, ...info } = container;
    infoContainer.initDetailValues(info);
    batchesContainer.initDetailValues({ batches, representativeBatch });
  }

  shouldComponentUpdate(nextProps: Props) {
    const { container } = this.props;

    return !isEquals(container, nextProps.container);
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { container, onSave } = this.props;
    return (
      <Provider inject={[formContainer, infoContainer, batchesContainer]}>
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="CONTAINER" color="CONTAINER" />
            <JumpToSection>
              <SectionTabs
                link="container_containerSection"
                label={
                  <FormattedMessage id="modules.container.container" defaultMessage="CONTAINER" />
                }
                icon="CONTAINER"
              />
              <SectionTabs
                link="container_batchesSection"
                label={<FormattedMessage id="modules.container.batches" defaultMessage="BATCHES" />}
                icon="BATCH"
              />
              <SectionTabs
                link="container_ordersSection"
                label={<FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" />}
                icon="ORDER"
              />
            </JumpToSection>
            <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
              {(containerInfoContainer, containerBatchesContainer) =>
                (containerInfoContainer.isDirty() || containerBatchesContainer.isDirty()) && (
                  <>
                    <ResetButton
                      onClick={() => {
                        resetFormState(containerInfoContainer);
                        resetFormState(containerBatchesContainer);
                        formContainer.onReset();
                      }}
                    />
                    <SaveButton
                      disabled={
                        !formContainer.isReady(
                          {
                            ...containerInfoContainer.state,
                            ...containerBatchesContainer.state,
                          },
                          validator
                        )
                      }
                      onClick={() =>
                        onSave({
                          ...containerInfoContainer.state,
                          ...containerBatchesContainer.state,
                        })
                      }
                    />
                  </>
                )
              }
            </Subscribe>
          </SlideViewNavBar>

          <Content>
            <ContainerForm isSlideView container={container} />
          </Content>
        </SlideViewLayout>
      </Provider>
    );
  }
}

export default ContainerFormInSlide;
