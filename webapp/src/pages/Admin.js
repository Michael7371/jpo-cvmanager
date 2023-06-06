import React, { useEffect } from 'react'
import AdminFormManager from '../components/AdminFormManager.js'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { useDispatch } from 'react-redux'
import { updateTableData as updateRsuTableData } from '../features/adminRsuTab/adminRsuTabSlice'
import { getAvailableUsers } from '../features/adminUserTab/adminUserTabSlice'

import '../features/adminRsuTab/Admin.css'

function Admin() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateRsuTableData())
    dispatch(getAvailableUsers())
  }, [dispatch])

  return (
    <div id="admin">
      <h2 className="adminHeader">CV Manager Admin Interface</h2>
      <Tabs>
        <TabList>
          <Tab>
            <p>RSUs</p>
          </Tab>
          <Tab>
            <p>Users</p>
          </Tab>
          <Tab>
            <p>Organizations</p>
          </Tab>
        </TabList>

        <TabPanel>
          <div className="panel-content">
            <AdminFormManager activeForm={'add_rsu'} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <AdminFormManager activeForm={'add_user'} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="panel-content">
            <AdminFormManager activeForm={'add_organization'} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default Admin
