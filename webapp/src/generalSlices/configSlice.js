import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CdotApi from '../apis/cdot-rsu-api'
import { selectToken, selectOrganizationName } from './userSlice'

const initialState = {
  msgFwdConfig: {},
  errorState: '',
  changeSuccess: false,
  rebootChangeSuccess: false,
  destIp: '',
  snmpMsgType: 'bsm',
  snmpFilterMsg: '',
  snmpFilterErr: false,
  addPoint: false,
}

export const refreshSnmpFwdConfig = createAsyncThunk(
  'config/refreshSnmpFwdConfig',
  async (ipList, { getState, dispatch }) => {
    const currentState = getState()
    const token = selectToken(currentState)
    const organization = selectOrganizationName(currentState)

    const body = {
      command: 'rsufwdsnmpwalk',
      rsu_ip: ipList,
      args: {},
    }

    const response = await CdotApi.postRsuData(token, organization, body, '')

    return response.status === 200
      ? { msgFwdConfig: response.body.RsuFwdSnmpwalk, errorState: '' }
      : { msgFwdConfig: {}, errorState: response.body.RsuFwdSnmpwalk }
  }
)

export const submitSnmpSet = createAsyncThunk('config/submitSnmpSet', async (ipList, { getState, dispatch }) => {
  const currentState = getState()
  const token = selectToken(currentState)
  const organization = selectOrganizationName(currentState)
  const destIp = selectDestIp(currentState)
  const snmpMsgType = selectSnmpMsgType(currentState)

  const body = {
    command: 'rsufwdsnmpset',
    rsu_ip: ipList,
    args: {
      dest_ip: destIp,
      msg_type: snmpMsgType,
    },
  }

  const response = await CdotApi.postRsuData(token, organization, body, '')

  return response.status === 200
    ? { changeSuccess: true, errorState: '' }
    : { changeSuccess: false, errorState: response.body.RsuFwdSnmpset }
})

export const deleteSnmpSet = createAsyncThunk('config/deleteSnmpSet', async (ipList, { getState, dispatch }) => {
  const currentState = getState()
  const token = selectToken(currentState)
  const organization = selectOrganizationName(currentState)
  const destIp = selectDestIp(currentState)
  const snmpMsgType = selectSnmpMsgType(currentState)

  const body = {
    command: 'rsufwdsnmpset-del',
    rsu_ip: ipList,
    args: {
      msg_type: snmpMsgType,
      dest_ip: destIp,
    },
  }

  const response = await CdotApi.postRsuData(token, organization, body, '')

  return response.status === 200
    ? { changeSuccess: true, errorState: '' }
    : { changeSuccess: false, errorState: response.body.RsuFwdSnmpset }
})

export const filterSnmp = createAsyncThunk('config/filterSnmp', async (ipList, { getState, dispatch }) => {
  const currentState = getState()
  const token = selectToken(currentState)
  const organization = selectOrganizationName(currentState)

  const body = {
    command: 'snmpFilter',
    rsu_ip: ipList,
    args: {},
  }

  const response = await CdotApi.postRsuData(token, organization, body, '')

  return response.status === 200
    ? { snmpFilterErr: false, snmpFilterMsg: 'Filter applied' }
    : {
        snmpFilterErr: true,
        snmpFilterMsg: 'Filter failed to be applied',
      }
})

export const rebootRsu = createAsyncThunk('config/rebootRsu', async (ipList, { getState, dispatch }) => {
  const currentState = getState()
  const token = selectToken(currentState)
  const organization = selectOrganizationName(currentState)

  const body = {
    command: 'reboot',
    rsu_ip: ipList,
    args: {},
  }

  CdotApi.postRsuData(token, organization, body, '')

  return
})

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    loading: false,
    value: initialState,
  },
  reducers: {
    setMsgFwdConfig: (state, action) => {
      state.value.msgFwdConfig = action.payload
    },
    setDestIp: (state, action) => {
      state.value.destIp = action.payload
    },
    setMsgType: (state, action) => {
      state.value.snmpMsgType = action.payload
    },
    togglePointSelect: (state) => {
      state.value.addPoint = !state.value.addPoint
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshSnmpFwdConfig.pending, (state) => {
        state.loading = true
        state.value.msgFwdConfig = {}
        state.value.errorState = ''
        console.debug('Pending refreshSnmpFwdConfig', state.loading)
      })
      .addCase(refreshSnmpFwdConfig.fulfilled, (state, action) => {
        state.loading = false
        state.value.msgFwdConfig = action.payload.msgFwdConfig
        state.value.errorState = action.payload.errorState
        console.debug('fulfilled refreshSnmpFwdConfig', state.loading)
      })
      .addCase(refreshSnmpFwdConfig.rejected, (state) => {
        state.loading = false
      })
      .addCase(submitSnmpSet.pending, (state) => {
        state.loading = true
        state.value.errorState = ''
        state.value.changeSuccess = false
      })
      .addCase(submitSnmpSet.fulfilled, (state, action) => {
        state.loading = false
        state.value.changeSuccess = action.payload.changeSuccess
        state.value.errorState = action.payload.errorState
      })
      .addCase(submitSnmpSet.rejected, (state) => {
        state.loading = false
      })
      .addCase(deleteSnmpSet.pending, (state) => {
        state.loading = true
        state.value.errorState = ''
        state.value.changeSuccess = false
      })
      .addCase(deleteSnmpSet.fulfilled, (state, action) => {
        state.loading = false
        state.value.changeSuccess = action.payload.changeSuccess
        state.value.errorState = action.payload.errorState
      })
      .addCase(deleteSnmpSet.rejected, (state) => {
        state.loading = false
      })
      .addCase(filterSnmp.pending, (state) => {
        state.loading = true
        state.value.snmpFilterMsg = ''
        state.value.snmpFilterErr = false
      })
      .addCase(filterSnmp.fulfilled, (state, action) => {
        state.loading = false
        state.value.snmpFilterMsg = action.payload.snmpFilterMsg
        state.value.snmpFilterErr = action.payload.snmpFilterErr
      })
      .addCase(filterSnmp.rejected, (state) => {
        state.loading = false
      })
      .addCase(rebootRsu.pending, (state) => {
        state.loading = true
        state.rebootChangeSuccess = false
      })
      .addCase(rebootRsu.fulfilled, (state, action) => {
        state.loading = false
        state.rebootChangeSuccess = true
      })
      .addCase(rebootRsu.rejected, (state) => {
        state.loading = false
        state.rebootChangeSuccess = false
      })
  },
})

export const selectMsgFwdConfig = (state) => state.config.value.msgFwdConfig
export const selectChangeSuccess = (state) => state.config.value.changeSuccess
export const selectRebootChangeSuccess = (state) => state.config.value.rebootChangeSuccess
export const selectErrorState = (state) => state.config.value.errorState
export const selectDestIp = (state) => state.config.value.destIp
export const selectSnmpMsgType = (state) => state.config.value.snmpMsgType
export const selectSnmpFilterMsg = (state) => state.config.value.snmpFilterMsg
export const selectSnmpFilterErr = (state) => state.config.value.snmpFilterErr
export const selectLoading = (state) => state.config.loading
export const selectAddPoint = (state) => state.config.value.addPoint

export const { setMsgFwdConfig, setDestIp, setMsgType, togglePointSelect } = configSlice.actions

export default configSlice.reducer
