import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    padding: 0 30px ${Platform.OS === 'android' ? 110 : 40}px;
`;

export const Title = styled.Text`
    font-size: 20px;
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity`
    position: absolute;
    left: 24px;
    top: 67px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
    max-width: 150px;
    align-self: center;
`;

export const UserAvatar = styled.Image`
    width: 150px;
    height: 150px;
    border-radius: 75px;
    margin-top: 90px;
    align-self: center;
`;
