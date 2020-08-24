// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import useUser from 'hooks/useUser';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_APPROVE_TIMELINE_DATE,
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
  DefaultAdjustmentStyle,
  DateInputFactory,
  ApprovalFactory,
} from 'components/Form';
import { TimelineInfoSectionWrapperStyle, AddDateButtonWrapperStyle } from './style';

type OptionalProps = {
  timelineDate: {
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
  groupIds: Array<string>,
};

const defaultProps = {
  renderBelowHeader: null,
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
    groupIds,
    ...rest
  } = props;
  const { user } = useUser();
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const approvedAt = getByPathWithDefault(null, 'approvedAt', timelineDate);
  const approvedBy = getByPathWithDefault(null, 'approvedBy', timelineDate);
  const timelineDateRevisions = getByPathWithDefault([], 'timelineDateRevisions', timelineDate);
  const date = getByPathWithDefault(null, 'date', timelineDate);

  return (
    <div className={TimelineInfoSectionWrapperStyle} {...rest}>
      <GridColumn gap="10px">
        <SectionHeader icon={icon} title={title}>
          {renderBelowHeader}
        </SectionHeader>

        <ApprovalFactory
          cacheKey="ShipmentUserSelect"
          groupIds={groupIds}
          name={sourceName}
          approvedAtName={`${sourceName}.approvedAt`}
          approvedAt={approvedAt}
          approvedByName={`${sourceName}.approvedBy`}
          approvedBy={approvedBy}
          setFieldValue={setFieldDeepValue}
          approvable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_APPROVE_TIMELINE_DATE])}
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
                      setFieldDeepValue(
                        `${sourceName}.timelineDateRevisions[${timelineDateRevisions.length}]`,
                        injectUid({
                          isNew: true,
                          type: 'Other',
                          date: date || todayForDateInput(),
                          memo: null,
                          updatedAt: new Date(),
                          updatedBy: user,
                        })
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
                            editable={hasPermission([
                              SHIPMENT_UPDATE,
                              SHIPMENT_SET_REVISE_TIMELINE_DATE,
                            ])}
                            required
                            hideTooltip
                            handleTimezone
                          />
                        )}
                      </FormField>
                    }
                  />
                )
            )}
          <FormField name={`${sourceName}.date`} initValue={date} setFieldValue={setFieldDeepValue}>
            {({ name, ...inputHandlers }) => (
              <DateInputFactory
                {...inputHandlers}
                name={name}
                isNew={isNew}
                editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TIMELINE_DATE])}
                label={
                  <FormattedMessage
                    id="modules.Shipments.initialDate"
                    defaultMessage="INITIAL DATE"
                  />
                }
                hideTooltip
                handleTimezone
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
