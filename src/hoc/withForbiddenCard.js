// @flow
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import BaseCard, { GrayCard } from 'components/Cards';
import { Blackout } from 'components/Form';
import { isNullOrUndefined } from 'utils/fp';

type OptionsType = {
  width: string,
  height: string,
  entityIcon: string,
  entityColor: string,
};

export default function withForbiddenCard(
  Card: React.ComponentType<any>,
  dataField: string,
  { width, height, entityIcon, entityColor }: OptionsType
) {
  return function ParsedForbiddenCard(props: any) {
    const { [dataField]: data, onClick, ...rest } = props;

    if (!data) return <GrayCard width={width} height={height} />;

    // TODO Change to use isForbidden from utils/data instead of id later
    if (isNullOrUndefined(data.id))
      return (
        <BaseCard icon={entityIcon} color={entityColor} {...rest}>
          <Blackout width={width} height={height} />
        </BaseCard>
      );

    return <Card {...props} />;
  };
}
