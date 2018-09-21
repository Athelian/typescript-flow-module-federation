// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { isDataType } from 'utils/fp';
import BatchFormContainer from 'modules/batch/form/container';
import validator from 'modules/batch/form/validator';
import BatchForm from 'modules/batch/form';
import { FormContainer } from 'modules/form';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';

type Props = {
  batch: Object,
  orderItem: Object,
  isNew: boolean,
  initDetailValues: Function,
  onSave: Function,
  onCancel: Function,
};

const formContainer = new FormContainer();

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
                  <CancelButton disabled={false} onClick={onCancel}>
                    Cancel
                  </CancelButton>
                  <SaveButton
                    disabled={!isDirty() || !formContainer.isReady(state, validator)}
                    onClick={() => onSave(state)}
                  >
                    Save
                  </SaveButton>
                </SlideViewNavBar>
              }
            >
              <BatchForm
                key={`${state.id}-${state.no}-${state.quantity}-${state.deliveredAt}`}
                batch={state}
                isNew={isNew}
                selectable={false}
              />
            </Layout>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default BatchFormWrapper;
