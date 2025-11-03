import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
    width?: number;
    height?: number;
    gender: string;
}

export default function GenderIcon(props: Props) {
    if (props.gender.toLowerCase() === 'male') {
        return (
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Path d="M9.83638 5.81926C8.86463 4.85219 7.52495 4.25449 6.04568 4.25449C3.07774 4.25449 0.671753 6.66048 0.671753 9.62841C0.671753 12.5963 3.07774 15.0023 6.04568 15.0023C9.01361 15.0023 11.4196 12.5963 11.4196 9.62841C11.4196 8.13975 10.8143 6.79247 9.83638 5.81926ZM9.83638 5.81926L15.0022 0.671875M15.0022 0.671875H11.4196M15.0022 0.671875V4.25449" stroke="#007AFF" stroke-width="1.34348" stroke-linecap="round" stroke-linejoin="round" />
            </Svg>

        );
    }
    else {
        return (
            <Svg width="13" height="18" viewBox="0 0 13 18" fill="none">
                <Path d="M6.04568 11.4197C9.01361 11.4197 11.4196 9.01373 11.4196 6.0458C11.4196 3.07786 9.01361 0.671875 6.04568 0.671875C3.07774 0.671875 0.671753 3.07786 0.671753 6.0458C0.671753 9.01373 3.07774 11.4197 6.04568 11.4197ZM6.04568 11.4197V16.7936M4.25437 15.0023H7.83698" stroke="#E84646" stroke-width="1.34348" stroke-linecap="round" stroke-linejoin="round" />
            </Svg>

        );
    }
}