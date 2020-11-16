import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Links } from 'parse-link-header'

import { Issue, IssuesResult, getIssue, getIssues } from 'api/githubAPI'
import { AppThunk } from 'app/store'

interface IssuesState {
  issuesByNumber: Record<number, Issue>
  currentPageIssues: number[]
  pageCount: number
  pageLinks: Links | null
  isLoading: boolean
  error: string | null
}

const issuesInitialState: IssuesState = {
  issuesByNumber: {},
  currentPageIssues: [],
  pageCount: 0,
  pageLinks: {},
  isLoading: false,
  error: null
}

function startLoading(state: IssuesState) {
  state.isLoading = true
}

function loadingFailed(state: IssuesState, action: PayloadAction<string>) {
  state.isLoading = false
  state.error = action.payload
}

const issues = createSlice({
  name: 'issues',
  initialState: issuesInitialState,
  reducers: {
    getIssueStart: startLoading,
    getIssuesStart: startLoading,
    getIssueSuccess(state, { payload }: PayloadAction<Issue>) {
      const { number } = payload
      state.issuesByNumber[number] = payload
      state.isLoading = false
      state.error = null
    },
    getissuesSuccess(state, { payload }: PayloadAction<IssuesResult>) {
      const { pageCount, issues, pageLinks } = payload
      state.pageCount = pageCount
      state.pageLinks = pageLinks
      state.isLoading = false
      state.error = null

      issues.forEach(issue => {
        state.issuesByNumber[issue.number] = issue
      })

      state.currentPageIssues = issues.map(issue => issue.number)
    },
    getIssueFailure: loadingFailed,
    getIssuesFailure: loadingFailed
  }
})

export const {
  getIssueStart,
  getIssueSuccess,
  getIssueFailure,
  getIssuesStart,
  getissuesSuccess,
  getIssuesFailure
} = issues.actions

export const issuesReducer = issues.reducer

export const fetchIssues = (
  org: string,
  repo: string,
  page?: number
): AppThunk => async dispatch => {
  dispatch(getIssuesStart())
  getIssues(org, repo, page).then(
    issues => dispatch(getissuesSuccess(issues)),
    err => dispatch(getIssuesFailure(err.toString()))
  )
}

export const fetchIssue = (
  org: string,
  repo: string,
  number: number
): AppThunk => async dispatch => {
  dispatch(getIssueStart())
  getIssue(org, repo, number).then(
    issue => dispatch(getIssueSuccess(issue)),
    err => dispatch(getIssueFailure(err.toSring()))
  )
}
