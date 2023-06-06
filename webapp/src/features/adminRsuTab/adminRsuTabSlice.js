import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { selectToken } from '../../generalSlices/userSlice'
import EnvironmentVars from '../../EnvironmentVars'
import apiHelper from '../../apis/api-helper'
import { getRsuInfoOnly } from '../../generalSlices/rsuSlice'

const initialState = {
  activeDiv: 'rsu_table',
  tableData: [],
  title: 'RSUs',
  columns: [
    { title: 'Milepost', field: 'milepost', id: 0 },
    { title: 'IP Address', field: 'ip', id: 1 },
    { title: 'Primary Route', field: 'primary_route', id: 2 },
    { title: 'RSU Model', field: 'model', id: 3 },
    { title: 'Serial Number', field: 'serial_number', id: 4 },
  ],
  editRsuRowData: {},
}

export const updateTableData = createAsyncThunk(
  'adminRsuTab/updateTableData',
  async (_, { getState, dispatch }) => {
    const currentState = getState()
    const token = selectToken(currentState)

    dispatch(getRsuInfoOnly())

    const data = await apiHelper._getDataWithCodes({
      url: EnvironmentVars.adminRsu,
      token,
      query_params: { rsu_ip: 'all' },
      additional_headers: { 'Content-Type': 'application/json' },
    })

    switch (data.status) {
      case 200:
        return data.body
      case 400:
      case 500:
        console.error(data.message)
        return
      default:
        return
    }
  },
  { condition: (_, { getState }) => selectToken(getState()) }
)

export const deleteRsu = createAsyncThunk(
  'adminRsuTabSlice/deleteRsu',
  async (payload, { getState, dispatch }) => {
    const { rsu_ip, shouldUpdateTableData } = payload
    const currentState = getState()
    const token = selectToken(currentState)

    const data = await apiHelper._deleteData({
      url: EnvironmentVars.adminRsu,
      token,
      query_params: { rsu_ip },
    })

    switch (data.status) {
      case 200:
        console.debug('Successfully deleted RSU: ' + rsu_ip)
        break
      case 400:
      case 500:
        break
      default:
        break
    }
    if (shouldUpdateTableData) {
      dispatch(updateTableData())
    }
  },
  { condition: (_, { getState }) => selectToken(getState()) }
)

export const deleteMultipleRsus = createAsyncThunk(
  'adminRsuTabSlice/deleteMultipleRsus',
  async (rows, { dispatch }) => {
    let promises = []
    for (const row of rows) {
      promises.push(dispatch(deleteRsu({ rsu_ip: row.ip, shouldUpdateTableData: false })))
    }
    Promise.all(promises).then(() => dispatch(updateTableData()))
  },
  { condition: (_, { getState }) => selectToken(getState()) }
)

export const adminRsuTabSlice = createSlice({
  name: 'adminRsuTab',
  initialState: {
    loading: false,
    value: initialState,
  },
  reducers: {
    setTitle: (state) => {
      if (state.value.activeDiv === 'rsu_table') {
        state.value.title = 'CV Manager RSUs'
      } else if (state.value.activeDiv === 'edit_rsu') {
        state.value.title = 'Edit RSU'
      } else if (state.value.activeDiv === 'add_rsu') {
        state.value.title = 'Add RSU'
      }
    },
    setActiveDiv: (state, action) => {
      state.value.activeDiv = action.payload
    },
    setEditRsuRowData: (state, action) => {
      state.value.editRsuRowData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTableData.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTableData.fulfilled, (state, action) => {
        state.loading = false
        state.value.tableData = action.payload?.rsu_data
      })
      .addCase(updateTableData.rejected, (state) => {
        state.loading = false
      })
      .addCase(deleteRsu.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteRsu.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(deleteRsu.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setTitle, setActiveDiv, setEditRsuRowData } = adminRsuTabSlice.actions

export const selectLoading = (state) => state.adminRsuTab.loading
export const selectActiveDiv = (state) => state.adminRsuTab.value.activeDiv
export const selectTableData = (state) => state.adminRsuTab.value.tableData
export const selectTitle = (state) => state.adminRsuTab.value.title
export const selectColumns = (state) => state.adminRsuTab.value.columns
export const selectEditRsuRowData = (state) => state.adminRsuTab.value.editRsuRowData

export default adminRsuTabSlice.reducer
