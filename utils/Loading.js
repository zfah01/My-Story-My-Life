import React from 'react';
import { ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

//Application Logo is displayed when application is loading 
export default function Loading(props) {
    const loading = props.loading;
    return (
        <ImageBackground source={require('../assets/logo.png')} style={{ width: '100%', height: '70%', opacity: 50, marginTop: 140}} >
            <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{color: '#FFFFFF'}} />
        </ImageBackground>
    );
}
