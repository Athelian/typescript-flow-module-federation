import React from 'react';
import {
  LoadingWrapperStyle,
  LoadingStyle,
  RowStyle,
  TriangleStyle,
  FlipStyle,
  InnerStyle,
  OuterStyle,
} from './style';

const LoadingIcon = () => (
  <div className={LoadingWrapperStyle}>
    <div className={LoadingStyle}>
      <div className={RowStyle}>
        <div className={`${TriangleStyle} ${OuterStyle(18)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(17)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(16)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(15)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(14)}`} />
      </div>
      <div className={RowStyle}>
        <div className={`${TriangleStyle} ${OuterStyle(1)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(2)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${InnerStyle(6)}`} />
        <div className={`${TriangleStyle} ${InnerStyle(5)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${InnerStyle(4)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(13)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(12)}`} />
      </div>
      <div className={RowStyle}>
        <div className={`${TriangleStyle} ${OuterStyle(3)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(4)}`} />
        <div className={`${TriangleStyle} ${InnerStyle(1)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${InnerStyle(2)}`} />
        <div className={`${TriangleStyle} ${InnerStyle(3)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(11)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(10)} ${FlipStyle}`} />
      </div>
      <div className={RowStyle}>
        <div className={`${TriangleStyle} ${OuterStyle(5)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(6)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(7)} ${FlipStyle}`} />
        <div className={`${TriangleStyle} ${OuterStyle(8)}`} />
        <div className={`${TriangleStyle} ${OuterStyle(9)} ${FlipStyle}`} />
      </div>
    </div>
  </div>
);

export default LoadingIcon;
