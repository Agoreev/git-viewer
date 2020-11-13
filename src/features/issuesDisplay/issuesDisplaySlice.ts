import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CurrentDisplay {
  displayType: 'issues' | 'comments'
  issueId: number | null
}
interface CurrentDisplayPayload {
  displayType: 'issues' | 'comments'
  issueId?: number
}

interface CurrentRepo {
  org: string
  repo: string
}

type CurrentDisplayState = {
  page: number
} & CurrentDisplay &
  CurrentRepo

let initialState: CurrentDisplayState = {
  org: 'rails',
  repo: 'rails',
  page: 1,
  displayType: 'issues',
  issueId: null
}

const issueDisplaySlice = createSlice({
  name: 'issueDisplay',
  initialState,
  reducers: {
    displayRepo(state, action: PayloadAction<CurrentRepo>) {
      const { repo, org } = action.payload
      state.repo = repo
      state.org = org
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setCurrentDisplayType(state, action: PayloadAction<CurrentDisplayPayload>) {
      const { displayType, issueId = null } = action.payload
      state.displayType = displayType
      state.issueId = issueId
    }
  }
})

export const {
  displayRepo,
  setCurrentPage,
  setCurrentDisplayType
} = issueDisplaySlice.actions

export default issueDisplaySlice.reducer
