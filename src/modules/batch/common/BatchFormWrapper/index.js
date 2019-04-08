// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'unstated';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import BatchForm from 'modules/batch/form';
import type { BatchFormState } from 'modules/batch/form/containers/type.js.flow';
import { initValues as infoInitValues } from 'modules/batch/form/containers/info';
import { initValues as taskInitValues } from 'modules/batch/form/containers/tasks';
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
  isReady: (formContainer: Object) => boolean,
};

const formContainer = new FormContainer();
class BatchFormWrapper extends React.Component<Props> {
  componentDidMount() {
    const { batch, orderItem, initDetailValues } = this.props;
    initDetailValues({
      ...infoInitValues,
      ...taskInitValues,
      ...batch,
      orderItem: {
        ...orderItem,
        batches: [],
      },
    });
  }

  componentWillUnmount() {
    const { initDetailValues } = this.props;
    formContainer.onReset();
    initDetailValues({
      ...infoInitValues,
      ...taskInitValues,
    });
  }

  render() {
    const { isNew, batch, onSave, isReady, onCancel } = this.props;
    return (
      <Provider inject={[formContainer]}>
        <Layout
          navBar={
            <SlideViewNavBar>
              <EntityIcon icon="BATCH" color="BATCH" />
              <JumpToSection>
                <SectionTabs
                  link="batch_batchSection"
                  label={<FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />}
                  icon="BATCH"
                />
                <SectionTabs
                  link="batch_quantityAdjustmentsSection"
                  label={
                    <FormattedMessage
                      id="modules.Batches.quantityAdjustments"
                      defaultMessage="QUANTITY ADJUSTMENTS"
                    />
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
              <CancelButton onClick={onCancel} />
              <SaveButton disabled={!isReady(formContainer)} onClick={onSave} />
            </SlideViewNavBar>
          }
        >
          <BatchForm selectable={false} batch={batch} isNew={isNew} />
        </Layout>
        );
      </Provider>
    );
  }
}

export default BatchFormWrapper;
