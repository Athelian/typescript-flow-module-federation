// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const WrapperStyle = css`
  background: #fff;
  width: 880px;
  ${borderRadiuses.MAIN};
`;

export const FormWrapperStyle = css`
  display: flex;
`;

export const ExporterSectionStyle = css`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const InputsWrapperStyle = css`
  flex: 2;
`;

export const ExporterCardStyle = css`
  width: 200px;
  height: 230px;
  cursor: pointer;
  img {
    border-radius: 5px 5px 0 0;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  div {
    text-align: center;
  }
`;

export const TagsInputStyle = css`
  margin-top: 16px;
`;

export const QuantitySummaryStyle = css`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  & > div {
    flex: 1;
    &:first-child {
      margin-right: 60px;
    }
    &:nth-child(2) {
      margin-left: 60px;
    }
  }
`;
