import React from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useDispatch, useSelector } from 'react-redux'

import {
  selectRebootChangeSuccess,

  // Actions
  rebootRsu,
} from '../generalSlices/configSlice'

import { selectRsuIpv4 } from '../generalSlices/rsuSlice'

import './css/SnmpwalkMenu.css'

const RsuRebootMenu = () => {
  const dispatch = useDispatch()
  const changeSuccess = useSelector(selectRebootChangeSuccess)

  const rsuIp = useSelector(selectRsuIpv4)

  const options = {
    title: 'RSU Reboot',
    message: 'Are you sure you want to perform a reboot?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => dispatch(rebootRsu([rsuIp])),
      },
      {
        label: 'No',
        onClick: () => {},
      },
    ],
    childrenElement: () => <div />,
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {},
  }

  return (
    <div id="snmpdiv">
      <h2 id="snmpheader">Administrator Reboot</h2>

      <button id="refreshbtn" onClick={() => confirmAlert(options)}>
        Reboot
      </button>

      {changeSuccess ? (
        <div>
          <p id="successtext">Successful reboot, the RSU will now be offline for a brief time</p>
          <p id="infotext">Warning: This action could result in taking the RSU offline</p>
        </div>
      ) : (
        <p id="infotext">Warning: This action could result in taking the RSU offline</p>
      )}
    </div>
  )
}

export default RsuRebootMenu
