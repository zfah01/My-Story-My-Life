import React from 'react';
import { ImageBackground } from 'react-native';

// Imports activity spinner to indicate application is loading
import Spinner from 'react-native-loading-spinner-overlay';

// Used for loading spinner when the application is loading from state or firebase.
export default function Loading(props) {
    const loading = props.loading;
    return (
        <ImageBackground source={require('../assets/logo.png')} style={{ width: '100%', height: '70%', opacity: 50}} >
            <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{color: '#FFFFFF'}} />
        </ImageBackground>
    );
}
