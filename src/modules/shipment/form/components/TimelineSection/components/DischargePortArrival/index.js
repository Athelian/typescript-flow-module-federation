// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_APPROVE_TIMELINE_DATE,
  SHIPMENT_ASSIGN_TIMELINE_DATE,
  SHIPMENT_SET_REVISE_TIMELINE_DATE,
  SHIPMENT_SET_TIMELINE_DATE,
} from 'modules/permission/constants/shipment';
import GridColumn from 'components/GridColumn';
import { injectUid } from 'utils/id';
import { Tooltip } from 'components/Tooltip';
import { NewButton } from 'components/Buttons';
import { FormField } from 'modules/form';
import { todayForDateInput } from 'utils/date';
import {
  SectionHeader,
  DischargePortArrivalAdjustmentWrapper,
  DateInputFactory,
  AssignmentApprovalFactory,
} from 'components/Form';
import { TimelineInfoSectionWrapperStyle, AddDateButtonWrapperStyle } from './style';

type OptionalProps = {
  timelineDate: {
    assignedTo: Array<{
      id: string,
      firstName: string,
      lastName: string,
    }>,
    timelineDateRevisions: Array<Object>,
    approvedAt: ?Date,
    approvedBy: ?{
      id: string,
      firstName: string,
      lastName: string,
    },
    date: ?Date,
  },
  renderBelowHeader: React.Node,
};

type Props = OptionalProps & {
  isNew: boolean,
  icon: string,
  title: React.Node,
  sourceName: string,
  setFieldDeepValue: (field: string, value: any) => void,
  setShipmentContainers: Function,
  shipmentContainers: Array<Object>,
  removeArrayItem: (path: string) => void,
  groupIds: Array<string>,
};

const defaultProps = {
  renderBelowHeader: null,
  timelineDate: {
    assignedTo: [],
    timelineDateRevisions: [],
    approvedAt: null,
    approvedBy: null,
    date: null,
  },
};

const DischargePortArrival = (props: Props) => {
  const {
    isNew,
    icon,
    title,
    timelineDate,
    sourceName,
    setFieldDeepValue,
    setShipmentContainers,
    shipmentContainers,
    removeArrayItem,
    renderBelowHeader,
    groupIds,
    ...rest
  } = props;
  const { user } = useUser();
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { timelineDateRevisions = [] } = timelineDate;
  return (
    <div className={TimelineInfoSectionWrapperStyle} {...rest}>
      <GridColumn gap="10px">
        <SectionHeader icon={icon} title={title}>
          {renderBelowHeader}
        </SectionHeader>

        <AssignmentApprovalFactory
          cacheKey="ShipmentUserSelect"
          groupIds={groupIds}
          name={sourceName}
          assignmentsName={`${sourceName}.assignedTo`}
          assignments={timelineDate && timelineDate.assignedTo}
          approvedAtName={`${sourceName}.approvedAt`}
          approvedAt={timelineDate && timelineDate.approvedAt}
          approvedByName={`${sourceName}.approvedBy`}
          approvedBy={timelineDate && timelineDate.approvedBy}
          setFieldValue={setFieldDeepValue}
          approvable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_APPROVE_TIMELINE_DATE])}
          assignable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_ASSIGN_TIMELINE_DATE])}
        />
        <GridColumn gap="10px" data-testid={`${sourceName}_DateRevisions`}>
          <div className={AddDateButtonWrapperStyle}>
            {hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_REVISE_TIMELINE_DATE]) && (
              <>
                {timelineDateRevisions.length < 5 ? (
                  <NewButton
                    data-testid={`${sourceName}_addDateButton`}
                    label={
                      <FormattedMessage id="modules.Shipments.newDate" defaultMessage="NEW DATE" />
                    }
                    onClick={() => {
                      const date = (timelineDate && timelineDate.date) || todayForDateInput();
                      setFieldDeepValue(
                        `${sourceName}.timelineDateRevisions[${timelineDateRevisions.length}]`,
                        injectUid({
                          isNew: true,
                          type: 'Other',
                          date,
                          memo: null,
                          updatedAt: new Date(),
                          updatedBy: user,
                        })
                      );
                      setShipmentContainers(
                        'containers',
                        shipmentContainers.map(container =>
                          container.autoCalculatedFreeTimeStartDate
                            ? {
                                ...container,
                                freeTimeStartDate: date,
                              }
                            : container
                        )
                      );
                    }}
                  />
                ) : (
                  <Tooltip
                    message={
                      <FormattedMessage
                        id="modules.shipment.max5"
                        defaultMessage="Only a maximum of 5 date revisions is allowed"
                      />
                    }
                  >
                    <div>
                      <NewButton
                        label={
                          <FormattedMessage
                            id="modules.Shipments.newDate"
                            defaultMessage="NEW DATE"
                          />
                        }
                        disabled
                      />
                    </div>
                  </Tooltip>
                )}
              </>
            )}
          </div>
          {timelineDateRevisions
            .slice()
            .reverse()
            .map(
              (adjustment, index) =>
                adjustment && (
                  <DischargePortArrivalAdjustmentWrapper
                    isNew={isNew}
                    editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_REVISE_TIMELINE_DATE])}
                    index={timelineDateRevisions.length - 1 - index}
                    adjustment={adjustment}
                    key={adjustment.id}
                    setFieldArrayValue={setFieldDeepValue}
                    shipmentContainers={shipmentContainers}
                    setShipmentContainers={setShipmentContainers}
                    removeArrayItem={removeArrayItem}
                    values={timelineDate}
                    enumType="TimelineDateRevisionType"
                    targetName={`${sourceName}.timelineDateRevisions`}
                    typeName="type"
                    memoName="memo"
                    valueInput={
                      <FormField
                        name={`${sourceName}.timelineDateRevisions.${timelineDateRevisions.length -
                          1 -
                          index}.date`}
                        initValue={adjustment.date}
                        setFieldValue={setFieldDeepValue}
                      >
                        {({ name, ...inputHandlers }) => (
                          <DateInputFactory
                            name={name}
                            isNew={isNew}
                            originalValue={adjustment.date}
                            editable={hasPermission([
                              SHIPMENT_UPDATE,
                              SHIPMENT_SET_REVISE_TIMELINE_DATE,
                            ])}
                            required
                            hideTooltip
                            {...{
                              ...inputHandlers,
                              onBlur: evt => {
                                inputHandlers.onBlur(evt);
                                setFieldDeepValue(name, inputHandlers.value);
                                if (index === 0) {
                                  setShipmentContainers(
                                    'containers',
                                    shipmentContainers.map(container =>
                                      container.autoCalculatedFreeTimeStartDate
                                        ? {
                                            ...container,
                                            freeTimeStartDate: inputHandlers.value,
                                          }
                                        : container
                                    )
                                  );
                                }
                              },
                            }}
                          />
                        )}
                      </FormField>
                    }
                  />
                )
            )}
          <FormField
            name={`${sourceName}.date`}
            initValue={timelineDate && timelineDate.date}
            setFieldValue={setFieldDeepValue}
          >
            {({ name, ...inputHandlers }) => (
              <DateInputFactory
                name={name}
                isNew={isNew}
                originalValue={timelineDate && timelineDate.date}
                editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TIMELINE_DATE])}
                label={
                  <FormattedMessage
                    id="modules.Shipments.initialDate"
                    defaultMessage="INITIAL DATE"
                  />
                }
                hideTooltip
                {...{
                  ...inputHandlers,
                  onBlur: evt => {
                    inputHandlers.onBlur(evt);
                    setFieldDeepValue(name, inputHandlers.value);
                    if (timelineDateRevisions.length === 0) {
                      setShipmentContainers(
                        'containers',
                        shipmentContainers.map(container =>
                          container.autoCalculatedFreeTimeStartDate
                            ? {
                                ...container,
                                freeTimeStartDate: inputHandlers.value,
                              }
                            : container
                        )
                      );
                    }
                  },
                }}
              />
            )}
          </FormField>
        </GridColumn>
      </GridColumn>
    </div>
  );
};

DischargePortArrival.defaultProps = defaultProps;

export default DischargePortArrival;
