import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Alert, AppBar, Button, Grid, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';

import Nui from '../../util/Nui';
import { useAlert, useMyStates } from '../../hooks';
const useStyles = makeStyles((theme) => ({
    wrapper: {
        height: '100%',
        background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(https://www.gtaboom.com/wp-content/uploads/2014/09/GTA-V-map-scale-768x950.webp)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", sans-serif',
    },
    content: {
        width: '85%',
        padding: '25px',
        background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    },
    header: {
        fontSize: '1.2rem',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '20px',
        textAlign: 'center',
        letterSpacing: '0.5px',
        opacity: 0.9,
    },
    editorField: {
        marginBottom: 20,
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.9rem',
        },
        '& .MuiInputBase-root': {
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '5px 12px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8E1467', // Your accent color
        },
    },
    primary: {
        height: '50px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontWeight: 600,
        textTransform: 'none', // Prevents all-caps for a cleaner look
        background: 'linear-gradient(135deg, #8E1467 0%, #630e48 100%)',
        color: '#ffade5',
        boxShadow: '0 4px 15px rgba(142, 20, 103, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'linear-gradient(135deg, #a61779 0%, #8E1467 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(142, 20, 103, 0.4)',
        },
    },
    anon: {
        marginTop: 15,
        height: '50px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: 600,
        textTransform: 'none',
        color: '#ff9800',
        borderColor: 'rgba(255, 152, 0, 0.3)',
        background: 'rgba(255, 152, 0, 0.05)',
        '&:hover': {
            background: 'rgba(255, 152, 0, 0.1)',
            borderColor: '#ff9800',
        },
    },
    icon: {
        marginRight: 10,
    },
}));

export default (props) => {
	const classes = useStyles();
	const hasState = useMyStates();
	const showAlert = useAlert();

	const [target, setTarget] = useState('');

	const onChange = (e) => {
		setTarget(+e.target.value);
	};

	const onPing = async () => {
		try {
			let res = await (
				await Nui.send('PingEm:Send', {
					target,
					type: false,
				})
			).json();
			if (res) {
				showAlert('Sent Ping');
			} else showAlert('Unable To Send Ping');
		} catch (err) {
			showAlert('Unable To Send Ping');
		}
	};

	const onAnonPing = async () => {
		try {
			let res = await (
				await Nui.send('PingEm:Send', {
					target,
					type: true,
				})
			).json();
			if (res) {
				showAlert('Sent Ping');
			} else showAlert('Unable To Send Ping');
		} catch (err) {
			showAlert('Unable To Send Ping');
		}
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.content}>
				<NumberFormat
					fullWidth
					required
					label="Target State ID"
					name="target"
					className={classes.editorField}
					type="tel"
					isNumericString
					customInput={TextField}
					value={target}
					onChange={onChange}
				/>
				<Button
					fullWidth
					className={classes.primary}
					variant="contained"
					onClick={onPing}
				>
					Send Ping
				</Button>
				{hasState('PHONE_VPN') && (
					<Button
						style={{ marginTop: 15 }}
						fullWidth
						variant="outlined"
						color="warning"
						onClick={onAnonPing}
					>
						<FontAwesomeIcon
							className={classes.icon}
							icon={['fas', 'user-secret']}
						/>
						Send Anonymous Ping
					</Button>
				)}
			</div>
		</div>
	);
};
