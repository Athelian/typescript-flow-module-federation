// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { isEquals } from 'utils/fp';
import ContainerForm from 'modules/container/form';
import { notificationSeeByEntitiesMutation } from 'components/common/QueryFormV2/mutation';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon, LogsButton } from 'components/NavBar';
import SlideView from 'components/SlideView';
import Timeline from 'modules/timeline/components/Timeline';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import {
  ContainerInfoContainer,
  ContainerBatchesContainer,
} from 'modules/container/form/containers';
import { containerTimelineQuery } from 'modules/container/query';
import validator from 'modules/container/form/validator';

type Props = {|
  container: Object,
  onSave: Function,
  isNew: boolean,
|};

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
    const { container, onSave, isNew } = this.props;
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
            <BooleanValue>
              {({ value: opened, set: slideToggle }) =>
                !isNew && (
                  <>
                    <LogsButton
                      entityType="container"
                      entityId={container.id}
                      onClick={() => slideToggle(true)}
                    />
                    <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                      <SlideViewLayout>
                        {opened && (
                          <>
                            <SlideViewNavBar>
                              <EntityIcon icon="LOGS" color="LOGS" />
                            </SlideViewNavBar>

                            <Content>
                              <Timeline
                                query={containerTimelineQuery}
                                queryField="container"
                                variables={{
                                  id: container.id,
                                }}
                                entity={{
                                  containerId: container.id,
                                }}
                                users={container.shipment.followers}
                              />
                            </Content>
                          </>
                        )}
                      </SlideViewLayout>
                    </SlideView>
                  </>
                )
              }
            </BooleanValue>
            <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
              {(containerInfoContainer, containerBatchesContainer) =>
                (containerInfoContainer.isDirty() || containerBatchesContainer.isDirty()) && (
                  <>
                    <ResetFormButton
                      onClick={() => {
                        resetFormState(containerInfoContainer);
                        resetFormState(containerBatchesContainer);
                        formContainer.onReset();
                      }}
                    />
                    <SaveFormButton
                      id="container_form_save_button"
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

const ContainerFormInSlideHoC = (props: Props) => {
  const { isNew, container } = props;
  const [notificationSeeByEntities] = useMutation(notificationSeeByEntitiesMutation);

  React.useEffect(() => {
    // mark as read notification on close
    return () => {
      if (!isNew && container?.id) {
        const notificationUnseenCount = container?.notificationUnseenCount ?? 0;
        if (notificationUnseenCount > 0) {
          notificationSeeByEntities({
            variables: {
              entities: [
                {
                  containerId: container?.id,
                },
              ],
            },
          });
        }
      }
    };
  }, [isNew, notificationSeeByEntities, container]);
  return <ContainerFormInSlide {...props} />;
};

export default ContainerFormInSlideHoC;
