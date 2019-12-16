// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import BatchForm from 'modules/batch/form';
import { FormContainer, resetFormState } from 'modules/form';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { EntityIcon } from 'components/NavBar';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { BatchInfoContainer, BatchTasksContainer } from 'modules/batch/form/containers';
import validator from 'modules/batch/form/validator';
import { READONLY } from 'modules/batch/constants';
import type {
  ItemConfigType,
  ShipmentConfigType,
  ContainerConfigType,
  OrderConfigType,
} from 'modules/batch/type';

type Props = {|
  itemConfig: ItemConfigType,
  shipmentConfig: ShipmentConfigType,
  containerConfig: ContainerConfigType,
  orderConfig: OrderConfigType,
  batch: Object,
  onSave: Function,
|};

const defaultProps = {
  itemConfig: READONLY,
  shipmentConfig: READONLY,
  containerConfig: READONLY,
  orderConfig: READONLY,
};

const formContainer = new FormContainer();

const BatchFormInSlide = ({ batch, onSave, ...rest }: Props) => {
  useEffect(() => {
    return () => formContainer.onReset();
  });

  return (
    <Provider inject={[formContainer]}>
      <Subscribe to={[BatchInfoContainer, BatchTasksContainer]}>
        {(batchInfoContainer, batchTasksContainer) => {
          return (
            <SlideViewLayout>
              <SlideViewNavBar>
                <EntityIcon icon="BATCH" color="BATCH" />
                <JumpToSection>
                  <SectionTabs
                    link="batch_batchSection"
                    label={<FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />}
                    icon="BATCH"
                  />
                  <SectionTabs
                    link="batch_quantitySection"
                    label={
                      <FormattedMessage id="modules.Batches.quantity" defaultMessage="QUANTITY" />
                    }
                    icon="QUANTITY_ADJUSTMENTS"
                  />
                  <SectionTabs
                    link="batch_packagingSection"
                    label={
                      <FormattedMessage id="modules.Batches.packaging" defaultMessage="PACKAGING" />
                    }
                    icon="PACKAGING"
                  />
                  <SectionTabs
                    link="batch_taskSection"
                    label={<FormattedMessage id="modules.Batches.task" defaultMessage="TASK" />}
                    icon="TASK"
                  />
                  <SectionTabs
                    link="batch_shipmentSection"
                    label={
                      <FormattedMessage id="modules.Batches.shipment" defaultMessage="SHIPMENT" />
                    }
                    icon="SHIPMENT"
                  />
                  <SectionTabs
                    link="batch_containerSection"
                    label={
                      <FormattedMessage id="modules.Batches.container" defaultMessage="SHIPMENT" />
                    }
                    icon="CONTAINER"
                  />
                  <SectionTabs
                    link="batch_orderSection"
                    label={<FormattedMessage id="modules.Batches.order" defaultMessage="ORDER" />}
                    icon="ORDER"
                  />
                </JumpToSection>
                {(batchInfoContainer.isDirty() || batchTasksContainer.isDirty()) && (
                  <>
                    <ResetFormButton
                      onClick={() => {
                        resetFormState(batchInfoContainer);
                        resetFormState(batchTasksContainer, 'todo');
                        formContainer.onReset();
                      }}
                    />
                    <SaveFormButton
                      id="batch_form_save_button"
                      disabled={
                        !formContainer.isReady(
                          {
                            ...batchInfoContainer.state,
                            ...batchTasksContainer.state,
                          },
                          validator
                        )
                      }
                      onClick={() =>
                        onSave({ ...batchInfoContainer.state, ...batchTasksContainer.state })
                      }
                    />
                  </>
                )}
              </SlideViewNavBar>

              <Content>
                <BatchForm
                  batch={batch}
                  onFormReady={() => {
                    const { todo, ...info } = batch;
                    batchInfoContainer.initDetailValues(info);
                    batchTasksContainer.initDetailValues(todo);
                  }}
                  {...rest}
                />
              </Content>
            </SlideViewLayout>
          );
        }}
      </Subscribe>
    </Provider>
  );
};

BatchFormInSlide.defaultProps = defaultProps;

export default BatchFormInSlide;
