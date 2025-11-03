import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
    width?: number;
    height?: number;
    state: 'filled' | 'outline';
    status?: 'normal' | 'disabled';
}

export default function HeartIcon(props: Props) {
    const fillColor = props.status === 'disabled' ? '#95979E' : (props.state === 'filled' ? "#E84646" : "none");
    const strokeColor = props.status === 'disabled' ? '#95979E' : (props.state === 'outline' ? "#E84646" : "none");

    return (
        <Svg width={props.width || 20} height={props.height || 18} viewBox="0 0 20 18" fill="none">
            <Path
                d="M14.0826 0C12.5406 0.0191666 11.0839 0.626109 10 1.66877C8.91614 0.627387 7.4555 0.0191666 5.89938 0C2.63487 0.0191666 -0.0128562 2.66288 4.69612e-05 5.88926C4.69612e-05 12.6014 6.84647 16.6596 8.94452 17.7444C9.27485 17.9144 9.63742 18 10 18C10.3626 18 10.7252 17.9144 11.0542 17.7444C13.1522 16.6609 20 12.6027 20 5.89309C20.0116 2.66288 17.3651 0.0191666 14.0826 0Z"
                fill={fillColor} />
        </Svg>
    );
}