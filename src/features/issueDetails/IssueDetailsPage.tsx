import React, { useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'

import { insertMentionLinks } from 'utils/stringUtils'

import { IssueLabels } from 'components/IssueLabels'

import { IssueMeta } from './IssueMeta'
import { IssueComments } from './IssueComments'

import { RootState } from 'app/rootReducer'
import { fetchIssue } from 'features/issuesList/issuesSlice'
import { fetchComments } from 'features/issueDetails/commentsSlice'

import styles from './IssueDetailsPage.module.css'
import './IssueDetailsPage.css'

interface IDProps {
  org: string
  repo: string
  issueId: number
  showIssuesList: () => void
}

export const IssueDetailsPage = ({
  org,
  repo,
  issueId,
  showIssuesList
}: IDProps) => {
  const dispatch = useDispatch()
  const issue = useSelector(
    (state: RootState) => state.issues.issuesByNumber[issueId]
  )
  const { comments, commentsLoading, commentsError } = useSelector(
    (state: RootState) => {
      return {
        commentsLoading: state.comments.loading,
        commentsError: state.comments.error,
        comments: state.comments.commentsByIssue[issueId]
      }
    },
    shallowEqual
  )

  useEffect(() => {
    if (!issue) {
      dispatch(fetchIssue(org, repo, issueId))
    }
    window.scrollTo({ top: 0 })
  }, [org, repo, issueId, issue, dispatch])

  useEffect(() => {
    if (issue) {
      dispatch(fetchComments(issue))
    }
  }, [issue, dispatch])

  let content

  const backToIssueListButton = (
    <button className="pure-button" onClick={showIssuesList}>
      Back to Issues List
    </button>
  )

  if (commentsError) {
    return (
      <div className="issue-detail--error">
        {backToIssueListButton}
        <h1>There was a problem loading issue #{issueId}</h1>
        <p>{commentsError.toString()}</p>
      </div>
    )
  }

  if (issue === null) {
    content = (
      <div className="issue-detail--loading">
        {backToIssueListButton}
        <p>Loading issue #{issueId}...</p>
      </div>
    )
  } else {
    let renderedComments = <IssueComments issue={issue} comments={comments} />

    content = (
      <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
        <h1 className="issue-detail__title">{issue.title}</h1>
        {backToIssueListButton}
        <IssueMeta issue={issue} />
        <IssueLabels labels={issue.labels} className={styles.issueLabels} />
        <hr className={styles.divider} />
        <div className={styles.summary}>
          <ReactMarkdown
            className={'testing'}
            source={insertMentionLinks(issue.body)}
          />
        </div>
        <hr className={styles.divider} />
        <ul>{renderedComments}</ul>
      </div>
    )
  }

  return <div>{content}</div>
}
