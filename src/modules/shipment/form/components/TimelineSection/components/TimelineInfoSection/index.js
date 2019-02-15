// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridColumn from 'components/GridColumn';
import { injectUid } from 'utils/id';
import { NewButton } from 'components/Buttons';
import { FormField } from 'modules/form';
import { DateInputFactory, AssignmentApprovalFactory } from 'modules/form/factories';
import { SectionHeader, DefaultAdjustmentStyle } from 'components/Form';
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
  readOnly: boolean,
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
  readOnly: false,
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
    readOnly,
    ...rest
  } = props;
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
          editable={!readOnly}
        />
        <GridColumn gap="10px" data-testid={`${sourceName}_DateRevisions`}>
          <div className={AddDateButtonWrapperStyle}>
            {!readOnly && (
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
                          editable={!readOnly}
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
                editable={!readOnly}
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
