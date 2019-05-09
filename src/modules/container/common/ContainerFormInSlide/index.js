// @flow
import React, { useEffect, useRef, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import ContainerForm from 'modules/container/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { FormContainer, resetFormState } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
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

const ContainerFormInSlide = ({ container, onSave }: Props) => {
  const hasInitialStateYet = useRef(false);
  useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  });

  const onFormReady = useCallback(
    (containerInfoContainer: Object, containerBatchesContainer: Object) => {
      if (hasInitialStateYet && hasInitialStateYet.current) return null;

      if (container.id) {
        hasInitialStateYet.current = true;
        const { batches = [], representativeBatch, ...info } = container;
        containerInfoContainer.initDetailValues(info);
        containerBatchesContainer.initDetailValues({ batches, representativeBatch });
      }
      return null;
    },
    [hasInitialStateYet, container]
  );

  return (
    <Provider inject={[formContainer]}>
      <Layout
        navBar={
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
        }
      >
        <Subscribe to={[ContainerInfoContainer, ContainerBatchesContainer]}>
          {(containerInfoContainer, containerBatchesContainer) =>
            onFormReady(containerInfoContainer, containerBatchesContainer)
          }
        </Subscribe>
        <ContainerForm inShipmentForm container={container} />
      </Layout>
    </Provider>
  );
};

export default ContainerFormInSlide;
