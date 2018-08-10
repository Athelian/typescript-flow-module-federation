// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Form } from 'components/Form';
import { isEquals } from 'utils/fp';
import Icon from 'components/Icon';
import type { BatchItem } from 'modules/batch/type.js.flow';
import { formatDateTimeToDate } from 'utils/date';
// import iconSet from 'components/Form/TasksInput/iconSet';
import Card from 'components/EntityCard';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import Backdrop from 'components/Backdrop';
// import QuantityInput from 'components/Inputs/NumberInput/QuantityInput';
import FallbackImage from 'media/logo_fallback.jpg';
import messages from 'modules/batch/messages';
import {
  ProductImageWrapperStyle,
  ImageWrapperStyle,
  ProductInfoWrapperStyle,
  ProductIconStyle,
  ProductNameStyle,
  ProductSerialStyle,
  ImageStyle,
  BatchNoStyle,
  LinksWrapperStyle,
  LinkIconStyle,
  LinkValueStyle,
  OrderWrapperStyle,
  ShipmentWrapperStyle,
  InfoWrapperStyle,
  QuantitySectionStyle,
  QuantityAdjustmentsTotalStyle,
  OriginalQuantityStyle,
  DateSectionStyle,
  DateOverrideSectionStyle,
  EditDateIconStyle,
  VerticalDividerStyle,
  LabelStyle,
  DateStyle,
  // DatePlaceholderStyle,
  // DateInputStyle,
  TaskAssignmentsWrapperStyle,
  LatestTaskWrapperStyle,
  LatestTaskStyle,
  LatestTaskDateStyle,
  TaskDividerStyle,
  AssignmentsWrapperStyle,
  AssignmentStyle,
  QuantityOverlayStyle,
  StackedAssignmentsWrapperStyle,
  AssignmentStackedWrapperStyle,
  NumberOfExtraAssignmentsStyle,
  TagsWrapperStyle,
  TagStyle,
  EyeIconStyle,
} from './style';

type Props = {
  batch: BatchItem,
  hideImage?: boolean,
  withAssignmentsModal?: boolean,
  intl: intlShape,
  readOnly?: boolean,
  dateOverride: any,
};

type State = {
  isEdit: ?('quantity' | 'deliveredAt'),
  isAssignModalOpen: boolean,
};

class BatchItemCard extends React.Component<Props, State> {
  static defaultProps = {
    hideImage: false,
    withAssignmentsModal: true,
    readOnly: false,
  };

  constructor() {
    super();
    this.state = {
      isEdit: null,
      isAssignModalOpen: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { isAssignModalOpen } = this.state;
    const { batch } = this.props;
    return !(isAssignModalOpen && nextState.isAssignModalOpen && batch.id !== nextProps.batch.id);
  }

  stopEditing = () => {
    this.setState({ isEdit: null });
  };

  editQuantity = () => {
    this.setState({ isEdit: 'quantity' });
  };

  editDeliveredAt = () => {
    this.setState({ isEdit: 'deliveredAt' }, () => {
      if (this.deliveredAtRef) {
        this.deliveredAtRef.focus();
      }
    });
  };

  openAssignEditModal = (e: Event) => {
    e.stopPropagation();
    this.setState({ isAssignModalOpen: true });
  };

  closeAssignEditModal = () => {
    this.setState({ isAssignModalOpen: false });
  };

  deliveredAtRef: ?HTMLInputElement;

  render() {
    const { batch, hideImage, intl, withAssignmentsModal, readOnly, dateOverride } = this.props;
    const { isEdit } = this.state;

    if (!batch) return null;

    const { product } =
      batch.orderItem.productExporterSupplier && batch.orderItem.productExporterSupplier;

    const image =
      product && product.files.length > 0
        ? `${process.env.ZENPORT_FS_URL || ''}/${product.files[0].path}`
        : FallbackImage;

    const inventoryQuantity =
      batch.realQuantity -
      (batch.adjustments
        ? batch.assignments.reduce((sum, assignment) => sum + assignment.quantity, 0)
        : 0);

    const hasLatestTask = !!(
      batch.batchGroup &&
      batch.batchGroup.taskManagement &&
      batch.batchGroup.taskManagement.lastApprovedTask
    );

    return (
      <Card icon="BATCH" color="BATCH">
        {!hideImage && (
          <div className={ProductImageWrapperStyle}>
            <div className={ImageWrapperStyle}>
              <div className={ProductInfoWrapperStyle}>
                <div className={ProductNameStyle}>{product.name}</div>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    // history.push(`/product/${encodeId(product.id)}`);
                  }}
                  className={ProductIconStyle}
                >
                  <Icon icon="PRODUCT" />
                </button>
                <div className={ProductSerialStyle}>{product.serial}</div>
              </div>
              <img src={image} alt="Product" className={ImageStyle} />
            </div>
          </div>
        )}

        <div className={BatchNoStyle(!!hideImage)}>{batch.no}</div>

        <div className={LinksWrapperStyle}>
          <div className={OrderWrapperStyle}>
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                // history.push(`/order/${encodeId(batch.orderItem.order.id)}`);
              }}
              className={LinkIconStyle(true)}
            >
              <Icon icon="ORDER" />
            </button>
            <div className={LinkValueStyle}>{batch.orderItem.order.PO}</div>
          </div>

          <div className={ShipmentWrapperStyle}>
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                if (batch.shipment) {
                  // history.push(`/shipment/${encodeId(batch.shipment.id)}`);
                }
              }}
              className={LinkIconStyle(!!batch.shipment)}
            >
              <Icon icon="SHIPMENT" />
            </button>
            <div className={LinkValueStyle}>{batch.shipment && (batch.shipment.no || 'N/A')}</div>
          </div>
        </div>

        <Form
          initialValues={{
            quantity: batch.quantity,
            deliveredAt: batch.deliveredAt
              ? formatDateTimeToDate(new Date(batch.deliveredAt))
              : null,
          }}
          enableReinitialize
          validateOnChange
          isInitialValid
          validate={() => ({})}
          onSubmit={(values, { setSubmitting }) => {
            const { quantity, deliveredAt } = batch;
            if (!isEquals(values, { quantity, deliveredAt })) {
              // onBatchItemChange(values);
            }
            setSubmitting(false);
            this.stopEditing();
          }}
        >
          {({ values, setFieldValue }) => (
            <div className={InfoWrapperStyle}>
              <Backdrop active={!!isEdit && isEdit === 'quantity'}>
                <div className={QuantitySectionStyle}>
                  <div className={LabelStyle}>{intl.formatMessage(messages.shortQuantity)}</div>
                  {batch.adjustments.length > 0 ? (
                    <React.Fragment>
                      <div className={QuantityAdjustmentsTotalStyle}>
                        <FormattedNumber
                          value={batch.adjustments.reduce(
                            (totalQuantity, adjustment) => totalQuantity + adjustment.quantity,
                            values.quantity
                          )}
                        />
                      </div>
                      <div className={OriginalQuantityStyle}>
                        <FormattedNumber value={values.quantity} />
                      </div>
                    </React.Fragment>
                  ) : (
                    <input
                      name="quantity"
                      value={values.quantity || 0}
                      type={readOnly ? 'readOnly' : 'inlineEdit'}
                      onClick={event => {
                        if (!readOnly) {
                          event.stopPropagation();
                          this.editQuantity();
                        }
                      }}
                      onChange={setFieldValue}
                      // onBlur={() => {
                      //   if (errors.quantity) {
                      //     resetForm();
                      //   } else {
                      //     submitForm();
                      //   }
                      // }}
                    />
                  )}
                </div>
              </Backdrop>

              <div className={VerticalDividerStyle} />

              {dateOverride ? (
                <div className={DateOverrideSectionStyle}>
                  <div className={LabelStyle}>{dateOverride.title}</div>
                  <div className={DateStyle}>
                    <FormattedDate value={dateOverride.value} />
                  </div>
                </div>
              ) : (
                <Backdrop active={!!isEdit && isEdit === 'deliveredAt'}>
                  <button
                    type="button"
                    className={DateSectionStyle(!!batch.deliveredAt)}
                    disabled={readOnly}
                    onClick={e => {
                      e.stopPropagation();
                      this.editDeliveredAt();
                    }}
                  >
                    <div className={EditDateIconStyle}>
                      <Icon icon="EDIT" />
                    </div>
                    <div className={LabelStyle}>{intl.formatMessage(messages.shortDeliveryAt)}</div>
                  </button>
                </Backdrop>
              )}
            </div>
          )}
        </Form>

        <div className={TaskAssignmentsWrapperStyle}>
          {hasLatestTask && (
            <React.Fragment>
              <div className={LatestTaskWrapperStyle}>
                <div className={LatestTaskStyle}>
                  <Icon icon="CONFIRM" />
                  {/* iconSet.find(icon => {
                        const findIcon =
                          batch.batchGroup &&
                          batch.batchGroup.taskManagement &&
                          batch.batchGroup.taskManagement.lastApprovedTask &&
                          batch.batchGroup.taskManagement.lastApprovedTask.icon;
                        return icon.iconName === findIcon;
                      }) || faCheck */}
                </div>
                <div className={LatestTaskDateStyle}>
                  <FormattedDate
                    value={
                      batch.batchGroup &&
                      batch.batchGroup.taskManagement &&
                      batch.batchGroup.taskManagement.lastApprovedTask &&
                      batch.batchGroup.taskManagement.lastApprovedTask.approvedAt
                    }
                    mode="date-no-year"
                  />
                </div>
              </div>
              <div className={TaskDividerStyle} />
            </React.Fragment>
          )}
          <button
            type="button"
            className={AssignmentsWrapperStyle}
            disabled={!withAssignmentsModal}
            onClick={this.openAssignEditModal}
          >
            <div className={EyeIconStyle}>
              <Icon icon="EYE" />
            </div>
            {batch.assignments.length > (hasLatestTask ? 2 : 3) ? (
              <React.Fragment>
                <div className={StackedAssignmentsWrapperStyle}>
                  <div className={AssignmentStyle(inventoryQuantity < 0)} style={{ zIndex: 4 }}>
                    <div className={QuantityOverlayStyle(batch.realQuantity, inventoryQuantity)} />
                    <Icon icon="INVENTORY" />
                  </div>

                  {batch.assignments.slice(0, hasLatestTask ? 2 : 3).map((assignment, index) => (
                    <div
                      className={AssignmentStackedWrapperStyle(index)}
                      key={`${assignment.id || index}`}
                    >
                      <div className={AssignmentStyle()}>
                        <div
                          className={QuantityOverlayStyle(batch.realQuantity, assignment.quantity)}
                        />
                        {assignment.user.lastName.toUpperCase().charAt(0)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={NumberOfExtraAssignmentsStyle}>
                  +<FormattedNumber value={batch.assignments.length - (hasLatestTask ? 2 : 3)} />
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={AssignmentStyle(inventoryQuantity < 0)}>
                  <div className={QuantityOverlayStyle(batch.realQuantity, inventoryQuantity)} />
                  <Icon icon="INVENTORY" />
                </div>

                {batch.assignments.map((assignment, index) => (
                  <div className={AssignmentStyle()} key={assignment.id || index}>
                    <div
                      className={QuantityOverlayStyle(batch.realQuantity, assignment.quantity)}
                    />
                    {assignment.user.lastName.toUpperCase().charAt(0)}
                  </div>
                ))}
              </React.Fragment>
            )}
          </button>
        </div>

        <div className={TagsWrapperStyle}>
          {batch.tags.map(tag => (
            <div className={TagStyle(tag.color)} key={tag.id}>
              {tag.name}
            </div>
          ))}
        </div>
      </Card>
    );
  }
}

export default injectIntl(BatchItemCard);
