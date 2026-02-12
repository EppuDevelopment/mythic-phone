import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    footer: {
        height: '80px',       
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'relative',
        cursor: 'pointer'
    },
    homeIndicator: {
        width: '280px',
        height: '8px',
        backgroundColor: '#FFFFFF', 
        borderRadius: '100px',
        opacity: 0.8,
        transition: 'all 0.2s ease-in-out',
        '&:active': {
            transform: 'scaleX(1.1)',
            opacity: 1
        }
    }
}));

export default (props => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleHomeGesture = () => {
        history.push('/');
    };

    const handleMinimize = () => {
        dispatch({ type: 'TOGGLE_EXPANDED' });
    };

    return (
        <Box className={classes.footer} onClick={handleHomeGesture}>

            <div className={classes.homeIndicator} />
        </Box>
    );
});