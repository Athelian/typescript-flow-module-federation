// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { isDataType } from 'utils/fp';
import BatchFormContainer from 'modules/batch/form/container';
import validator from 'modules/batch/form/validator';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import BatchForm from 'modules/batch/form';
import type { BatchFormState } from 'modules/batch/form/container';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

type Props = {
  batch: Object,
  orderItem: Object,
  isNew: boolean,
  initDetailValues: BatchFormState => void,
  onSave: Function,
  onCancel: Function,
};

const formContainer = new FormContainer();

const formatDateValue = (batch: BatchFormState) => {
  const { deliveredAt, expiredAt, producedAt, ...rest } = batch;
  return {
    ...rest,
    deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
    expiredAt: expiredAt ? new Date(expiredAt) : null,
    producedAt: producedAt ? new Date(producedAt) : null,
  };
};

class BatchFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { batch, orderItem, initDetailValues } = this.props;
    const { deliveredAt, expiredAt, producedAt, ...rest } = batch;
    initDetailValues({
      ...rest,
      orderItem,
      deliveredAt: isDataType(String, deliveredAt)
        ? deliveredAt
        : deliveredAt && deliveredAt.toISOString(),
      expiredAt: isDataType(String, expiredAt) ? expiredAt : expiredAt && expiredAt.toISOString(),
      producedAt: isDataType(String, producedAt)
        ? producedAt
        : producedAt && producedAt.toISOString(),
    });
  }

  componentWillUnmount() {
    formContainer.onReset();
  }

  render() {
    const { isNew, onSave, onCancel } = this.props;
    return (
      <Provider inject={[formContainer]}>
        <Subscribe to={[BatchFormContainer]}>
          {({ state, isDirty }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="BATCH" color="BATCH" />
                  <JumpToSection>
                    <SectionTabs link="batchSection" label="BATCH" icon="BATCH" />
                    <SectionTabs
                      link="quantityAdjustmentsSection"
                      label="QUANTITY ADJUSTMENTS"
                      icon="QUANTITY_ADJUSTMENTS"
                    />
                    <SectionTabs link="packagingSection" label="PACKAGING" icon="PACKAGING" />
                  </JumpToSection>
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    disabled={!isDirty() || !formContainer.isReady(state, validator)}
                    onClick={() => onSave(formatDateValue(state))}
                  />
                </SlideViewNavBar>
              }
            >
              <BatchForm batch={state} isNew={isNew} selectable={false} />
            </Layout>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default BatchFormWrapper;
