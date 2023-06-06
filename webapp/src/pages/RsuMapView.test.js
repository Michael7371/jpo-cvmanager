import React from 'react'
import { render } from '@testing-library/react'
import RsuMapView from './RsuMapView'
import { Provider } from 'react-redux'
import { setupStore } from '../store'
import { replaceChaoticIds } from '../utils/test-utils'

it('should take a snapshot', () => {
  const initialState = {
    rsu: { value: { selectedRsu: { geometry: { coordinates: [0, 1] } }, selectedSrm: [], srmSsmList: [] } },
  }
  const { container } = render(
    <Provider store={setupStore(initialState)}>
      <RsuMapView />
    </Provider>
  )

  expect(replaceChaoticIds(container)).toMatchSnapshot()
})
