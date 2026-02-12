import React, { useState } from 'react';
import { compose } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Confirm } from '../../components';
import { showIncoming } from '../../Apps/phone/action';
import Nui from '../../util/Nui';
import { useAlert, useMyStates } from '../../hooks';
import { DurationToTime } from '../../util/Parser';

export default compose(
    withRouter,
    connect(null, { showIncoming }),
)((props) => {
    const hasState = useMyStates();
    const limited = useSelector((state) => state.phone.limited);
    const callData = useSelector((state) => state.call.call);
    const time = useSelector(state => state.phone.time);
    const expanded = useSelector((state) => state.phone.expanded); // Track if phone is open/closed

    const useStyles = makeStyles((theme) => ({
        header: {
            background:
                props.location.pathname != '/' &&
                props.location.pathname != '/apps'
                    ? '#121212' 
                    : 'transparent',
            height: '8%',
            margin: 'auto',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            fontSize: '16px',
            lineHeight: '75px',
            padding: '0 20px 0 20px', 
            userSelect: 'none',
        },
        hLeft: {
            color: '#FFFFFF',
        },
        hRight: {
            textAlign: 'right',
            color: '#FFFFFF',
        },
        headerIcon: {
            marginLeft: 12,
            transition: 'all 0.2s ease',
            '&.clickable': {
                cursor: 'pointer',
                '&:hover': {
                    color: '#FFFFFF', 
                    transform: 'scale(1.1)',
                },
                '&:active': {
                    transform: 'scale(0.9)',
                }
            },
            '&.wifi': {
                color: limited
                    ? '#FFCC00' 
                    : hasState('PHONE_VPN')
                    ? '#FF3B30'
                    : '#FFFFFF',
            },
            '&.race': {
                color: '#5856D6',
            },
        },
        callActive: {
            marginLeft: 10,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        timer: {
            fontSize: 12,
            color: '#EBEBF5',
        },
    }));

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const showAlert = useAlert();
    const usb = useSelector((state) => state.usb.usb);
    const sharing = useSelector((state) => state.share.sharing);

    const onClickCall = () => {
        if (callData != null) {
            history.push(`/apps/phone/call/${callData.number}`);
        }
    };

    // The minimize logic you requested
    const minimize = (e) => {
        e.preventDefault();
        dispatch({
            type: 'TOGGLE_EXPANDED'
        });
    };

    const sharePrompt = (e) => {
        e.preventDefault();
        if (!sharing) return;
        dispatch({
            type: 'USE_SHARE',
            payload: true,
        });
    };

    return (
        <div>
            <Grid container className={classes.header}>
                <Grid item xs={5} className={classes.hLeft}>
                    {(time?.hour ?? 0).toString().padStart(2, '0')}:{(time?.minute ?? 0).toString().padStart(2, '0')}
                    {Boolean(callData) &&
                        !props.location.pathname.startsWith(
                            '/apps/phone/call',
                        ) &&
                        (callData.state == 0 ? (
                            <small className={classes.callActive} onClick={onClickCall}> Calling </small>
                        ) : callData.state == 1 ? (
                            <small className={classes.callActive} onClick={onClickCall}> Incoming </small>
                        ) : (
                            <small className={classes.callActive} onClick={onClickCall}>
                                <Moment durationFromNow interval={1000} className={classes.timer} format="mm:ss" date={callData.start} />
                            </small>
                        ))}
                </Grid>

                <Grid item xs={7} className={classes.hRight}>
                    <FontAwesomeIcon
                        className={`${classes.headerIcon} clickable`}
                        onClick={minimize}
                        icon={['fas', expanded ? 'minimize' : 'maximize']}
                    />

                    {sharing != null && (
                        <FontAwesomeIcon
                            className={`${classes.headerIcon} clickable`}
                            onClick={sharePrompt}
                            icon="share-nodes"
                        />
                    )}
                    {!limited && hasState('RACE_DONGLE') && (
                        <FontAwesomeIcon
                            className={`${classes.headerIcon} race`}
                            icon="flag-checkered"
                        />
                    )}
                    <FontAwesomeIcon
                        className={`${classes.headerIcon} wifi`}
                        icon="wifi"
                    />
                    <FontAwesomeIcon
                        className={classes.headerIcon}
                        icon="signal"
                    />
                </Grid>
            </Grid>
        </div>
    );
});