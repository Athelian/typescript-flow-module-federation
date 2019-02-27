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
import { NewButton } from 'components/Buttons';
import { FormField } from 'modules/form';
import {
  SectionHeader,
  DefaultAdjustmentStyle,
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
    approvedAt: ?Date,
    approvedBy: ?{
      id: string,
      firstName: string,
      lastName: string,
    },
    timelineDateRevisions: Array<Object>,
    date: Date,
  },
  renderBelowHeader: React.Node,
};

type Props = OptionalProps & {
  isNew: boolean,
  icon: string,
  title: React.Node,
  sourceName: string,
  setFieldDeepValue: (field: string, value: any) => void,
  removeArrayItem: (path: string) => void,
};

const defaultProps = {
  renderBelowHeader: null,
  timelineDate: { assignedTo: [], timelineDateRevisions: [] },
};

const TimelineInfoSection = (props: Props) => {
  const {
    isNew,
    icon,
    title,
    timelineDate,
    sourceName,
    setFieldDeepValue,
    removeArrayItem,
    renderBelowHeader,
    ...rest
  } = props;
  const { user } = useUser();
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const timelineDateRevisions = [...((timelineDate && timelineDate.timelineDateRevisions) || [])];
  return (
    <div className={TimelineInfoSectionWrapperStyle} {...rest}>
      <GridColumn gap="10px">
        <SectionHeader icon={icon} title={title}>
          {renderBelowHeader}
        </SectionHeader>

        <AssignmentApprovalFactory
          assignmentsName={`${sourceName}.assignedTo`}
          assignments={timelineDate && timelineDate.assignedTo}
          approvedAtName={`${sourceName}.approvedAt`}
          approvedAt={timelineDate && timelineDate.approvedAt}
          approvedByName={`${sourceName}.approvedBy`}
          approvedBy={timelineDate && timelineDate.approvedBy}
          setFieldValue={setFieldDeepValue}
          editable={hasPermission([SHIPMENT_UPDATE])}
          approvable={hasPermission([SHIPMENT_APPROVE_TIMELINE_DATE])}
          assignable={hasPermission([SHIPMENT_ASSIGN_TIMELINE_DATE])}
        />
        <GridColumn gap="10px" data-testid={`${sourceName}_DateRevisions`}>
          <div className={AddDateButtonWrapperStyle}>
            {hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_REVISE_TIMELINE_DATE]) && (
              <NewButton
                data-testid={`${sourceName}_addDateButton`}
                label={
                  <FormattedMessage id="modules.Shipments.newDate" defaultMessage="NEW DATE" />
                }
                onClick={() => {
                  setFieldDeepValue(
                    `${sourceName}.timelineDateRevisions[${timelineDateRevisions.length}]`,
                    injectUid({
                      isNew: true,
                      type: 'Other',
                      date: '',
                      memo: '',
                      updatedAt: new Date(),
                      updatedBy: user,
                    })
                  );
                }}
              />
            )}
          </div>
          {timelineDateRevisions.reverse().map(
            (adjustment, index) =>
              adjustment && (
                <DefaultAdjustmentStyle
                  isNew={isNew}
                  editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_REVISE_TIMELINE_DATE])}
                  index={timelineDateRevisions.length - 1 - index}
                  adjustment={adjustment}
                  key={adjustment.id}
                  setFieldArrayValue={setFieldDeepValue}
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
                          {...inputHandlers}
                          name={name}
                          isNew={isNew}
                          originalValue={adjustment.date}
                          editable={hasPermission([
                            SHIPMENT_UPDATE,
                            SHIPMENT_SET_REVISE_TIMELINE_DATE,
                          ])}
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
                {...inputHandlers}
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
              />
            )}
          </FormField>
        </GridColumn>
      </GridColumn>
    </div>
  );
};

TimelineInfoSection.defaultProps = defaultProps;

export default TimelineInfoSection;
