// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isNullOrUndefined } from 'utils/fp';
import GridColumn from 'components/GridColumn';
import { FieldItem, Label, Display } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import {
  SummaryWrapperStyle,
  LeftPartWrapperStyle,
  BlueStyle,
  GrayLightStyle,
  TealStyle,
} from './style';

type OptionalProps = {
  agreedArrivalDateFrom: Date,
  agreedArrivalDateTo: Date,
  actualArrivalDateFrom: Date,
  actualArrivalDateTo: Date,
};

type Props = OptionalProps & {
  containers: Array<Object>,
  approvedAgreementSize: number,
  approvedConfirmationSize: number,
};

const Summary = ({
  agreedArrivalDateFrom,
  agreedArrivalDateTo,
  actualArrivalDateFrom,
  actualArrivalDateTo,
  containers,
  approvedAgreementSize,
  approvedConfirmationSize,
}: Props) => (
  <div className={SummaryWrapperStyle}>
    <GridColumn>
      <div className={LeftPartWrapperStyle}>
        <GridColumn>
          <div>&nbsp;</div>
          <div>
            <FormattedMessage id="modules.shipment.agreedArrival" defaultMessage="AGREED ARRIVAL" />
          </div>
          <div>
            <FormattedMessage id="modules.shipment.agreedArrival" defaultMessage="AGREED ARRIVAL" />
          </div>
        </GridColumn>
        <GridColumn>
          <div>
            <FormattedMessage id="modules.shipment.from" defaultMessage="FROM" />
          </div>
          {isNullOrUndefined(agreedArrivalDateFrom) ? (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          ) : (
            <div className={BlueStyle}>
              <FormattedDate mode="datetime" value={agreedArrivalDateFrom} />
            </div>
          )}

          {isNullOrUndefined(actualArrivalDateFrom) ? (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          ) : (
            <div className={BlueStyle}>
              <FormattedDate mode="datetime" value={actualArrivalDateFrom} />
            </div>
          )}
        </GridColumn>
        <GridColumn>
          <div>
            <FormattedMessage id="modules.shipment.to" defaultMessage="TO" />
          </div>

          {isNullOrUndefined(agreedArrivalDateTo) ? (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          ) : (
            <div className={TealStyle}>
              <FormattedDate mode="datetime" value={agreedArrivalDateTo} />
            </div>
          )}

          {isNullOrUndefined(actualArrivalDateTo) ? (
            <div className={GrayLightStyle}>
              <FormattedMessage id="modules.shipment.noDate" defaultMessage="No date" />
            </div>
          ) : (
            <div className={TealStyle}>
              <FormattedDate mode="datetime" value={actualArrivalDateTo} />
            </div>
          )}
        </GridColumn>
      </div>
    </GridColumn>
    <GridColumn>
      <FieldItem
        label={
          <Label>
            <FormattedMessage
              id="modules.shipment.noOfContainers"
              defaultMessage="NO. OF CONTAINERS"
            />
          </Label>
        }
        input={
          <Display>
            <FormattedNumber value={containers.length} /> <Icon icon="CONTAINER" />
          </Display>
        }
      />
      <FieldItem
        label={
          <Label>
            <FormattedMessage
              id="modules.shipment.noOfApprovedAgreements"
              defaultMessage="NO. OF APPROVED AGREEMENTS"
            />
          </Label>
        }
        input={
          <Display color="BLUE">
            <FormattedNumber value={approvedAgreementSize} /> <Icon icon="CONTAINER" />
          </Display>
        }
      />
      <FieldItem
        label={
          <Label>
            <FormattedMessage
              id="modules.shipment.noOfApprovedConfirmations"
              defaultMessage="NO. OF APPROVED CONFIRMATIONS"
            />
          </Label>
        }
        input={
          <Display color="TEAL">
            <FormattedNumber value={approvedConfirmationSize} /> <Icon icon="CONTAINER" />
          </Display>
        }
      />
    </GridColumn>
  </div>
);

export default Summary;
