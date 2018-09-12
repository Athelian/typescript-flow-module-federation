// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { isDataType } from 'utils/fp';
import BatchFormContainer from 'modules/batch/form/container';
import BatchForm from 'modules/batch/form';
import { FormContainer } from 'modules/form';
import { SectionNavBar as NavBar, EntityIcon } from 'components/NavBar';
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
    const { deliveredAt, ...rest } = batch;
    initDetailValues({
      ...rest,
      orderItem,
      deliveredAt: isDataType(String, deliveredAt)
        ? deliveredAt
        : deliveredAt && deliveredAt.toISOString(),
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
            <>
              <NavBar>
                <EntityIcon icon="BATCH" color="BATCH" />
                <CancelButton disabled={false} onClick={onCancel}>
                  Cancel
                </CancelButton>
                <SaveButton
                  disabled={!isDirty() || !formContainer.isReady()}
                  onClick={() => onSave(state)}
                >
                  Save
                </SaveButton>
              </NavBar>
              <BatchForm
                key={`${state.id}-${state.no}-${state.quantity}-${state.deliveredAt}`}
                batch={state}
                isNew={isNew}
                selectable={false}
              />
            </>
          )}
        </Subscribe>
      </Provider>
    );
  }
}

export default BatchFormWrapper;
