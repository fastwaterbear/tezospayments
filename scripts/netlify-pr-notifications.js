const actionContext = {
  github: null,
  context: null,
  commitSha: null
};

const MAX_COMMENTS_PER_PAGE = 100;
const MAX_COMMENT_PAGES = 100;
const DEPLOY_PREVIEWS_COMMENT_MESSAGE_PREFIX = '✔️ Application Deploy Previews';
const DEPLOY_COUNTER_REGEX = new RegExp(`${DEPLOY_PREVIEWS_COMMENT_MESSAGE_PREFIX} \\*\\*\\[ (\\d+) \\]\\*\\*`);
const DEPLOY_PREVIEWS_COMMENT_EXPLORE_TITLE = '🔨 Explore the source changes';
const DEPLOY_PREVIEWS_COMMENT_BROWSE_TITLE = '😎 Browse application previews';

/**
 * 
 * @param {number} counter 
 * @param {App[]} apps 
 * @returns 
 */
const buildDeployPreviewsCommentMessage = (counter, apps) => `
${DEPLOY_PREVIEWS_COMMENT_MESSAGE_PREFIX} **[ ${counter} ]**

${DEPLOY_PREVIEWS_COMMENT_EXPLORE_TITLE}: ${actionContext.commitSha}

${DEPLOY_PREVIEWS_COMMENT_BROWSE_TITLE}:
${apps.map(app => `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${app.name}: [${app.link}](${app.link})`).join('\n')}
`;

/**
 * @param {string} deployPreviewsCommentMessage
 * @returns {App[]}
 */
const parseApps = deployPreviewsCommentMessage => {
  const appsList = deployPreviewsCommentMessage.substring(
    deployPreviewsCommentMessage.indexOf(DEPLOY_PREVIEWS_COMMENT_BROWSE_TITLE) + DEPLOY_PREVIEWS_COMMENT_BROWSE_TITLE.length + 2, // 2 is ':\n'
    deployPreviewsCommentMessage.length - 2 // 2 is 1 + '\n'
  );
  const appRawInfos = appsList.split('\n');

  return appRawInfos.map(appRawInfo => ({
    name: appRawInfo.substring(appRawInfo.lastIndexOf('&nbsp;') + 6, appRawInfo.indexOf(':')),
    link: appRawInfo.substring(appRawInfo.lastIndexOf('(') + 1, appRawInfo.length - 2) // 2 is 1 + ')'
  }));
};

/**
 * @param issueNumber {number}
 * @param page {number}
 * @returns {Promise<Array<IssueComment>>}
 */
const fetchCurrentIssueComments = page => actionContext.github.rest.issues.listComments({
  owner: actionContext.context.repo.owner,
  repo: actionContext.context.repo.repo,
  issue_number: actionContext.context.issue.number,
  per_page: MAX_COMMENTS_PER_PAGE,
  page
}).then(response => response.data);

const findDeployPreviewsComment = async () => {
  for (let pageNumber = 1; pageNumber <= MAX_COMMENT_PAGES; pageNumber++) {
    // eslint-disable-next-line no-await-in-loop
    const comments = await fetchCurrentIssueComments(pageNumber);

    if (!comments.length)
      return null;

    const deployPreviewsComment = comments.find(comment => comment.user.login === 'github-actions[bot]' && comment.body.indexOf(DEPLOY_PREVIEWS_COMMENT_MESSAGE_PREFIX) > -1);
    if (deployPreviewsComment)
      return deployPreviewsComment;
  }

  throw new Error('Maximum number of comment pages has been reached', MAX_COMMENT_PAGES);
};

/**
 * @param {NetlifyDeployResult} netlifyDeployResult 
 * @returns {Promise<IssueComment>}
 */
const createDeployPreviewsComment = (currentAppName, netlifyDeployResult) => {
  const body = buildDeployPreviewsCommentMessage(1, [{ name: currentAppName, link: netlifyDeployResult.deploy_url }]);

  return actionContext.github.rest.issues.createComment({
    owner: actionContext.context.repo.owner,
    repo: actionContext.context.repo.repo,
    issue_number: actionContext.context.issue.number,
    body,
  }).then(response => response.data);
};

/**
 * @param {IssueComment} comment
 * @param {NetlifyDeployResult} netlifyDeployResult 
 * @returns {Promise<IssueComment>}
 */
const updateDeployPreviewsComment = (comment, currentAppName, netlifyDeployResult) => {
  const commentCounter = Number.parseInt(comment.body.match(DEPLOY_COUNTER_REGEX)[1]) + 1;
  const apps = parseApps(comment.body);

  const currentApp = apps.find(app => app.name === currentAppName);
  if (currentApp)
    currentApp.link = netlifyDeployResult.deploy_url;
  else
    apps.push({ name: currentAppName, link: netlifyDeployResult.deploy_url });

  const updatedBody = buildDeployPreviewsCommentMessage(commentCounter, apps);

  return actionContext.github.rest.issues.updateComment({
    owner: actionContext.context.repo.owner,
    repo: actionContext.context.repo.repo,
    comment_id: comment.id,
    body: updatedBody,
  }).then(response => response.data);
};

/**
 * @param {{ github: any, context: any, netlifyDeployResult: NetlifyDeployResult }} param0 
 */
module.exports = async ({ github, context, commitSha, currentAppName, netlifyDeployResult }) => {
  actionContext.github = github;
  actionContext.context = context;
  actionContext.commitSha = commitSha;

  const comment = await findDeployPreviewsComment();

  if (!comment) {
    console.log('Application Deploy Previews Comment not found, creating...');
    const createdComment = await createDeployPreviewsComment(currentAppName, netlifyDeployResult);
    console.log(`Application Deploy Previews Comment has been created, id = ${createdComment.id}`);
  }
  else {
    console.log(`Application Deploy Previews Comment found, id = ${comment.id}`);
    await updateDeployPreviewsComment(comment, currentAppName, netlifyDeployResult);
    console.log(`Application Deploy Previews Comment has been updated, id = ${comment.id}`);
  }

  console.log('Complete the "netlify-pr-notifications.js" script');
};

/* Types */

/**
 * App
 * @typedef {{
 *  name: string,
 *  link: string,
 * } App
 */

/**
 * Issue comment
 * @typedef {{
 *  url: string,
 *  html_url: string,
 *  issue_url: string,
 *  id: number,
 *  node_id: string,
 *  user: GitHubUser,
 *  created_at: string,
 *  updated_at: string
 *  author_association: string,
 *  body: string
 * }} IssueComment
 */

/**
 * GitHub User
 * @typedef {{
 *  login: string,
 *  id: number,
 *  avatar_url: string,
 *  gravatar_id: string,
 *  url: string,
 *  html_url: string,
 *  followers_url: string,
 *  following_url: string,
 *  gists_url: string,
 *  starred_url: string,
 *  subscriptions_url: string,
 *  organizations_url: string,
 *  repos_url: string,
 *  events_url: string,
 *  received_events_url: string,
 *  type: string,
 *  site_admin: boolean,
 * }} GitHubUser
 */

/**
 * Netlify Deploy Result
 * @typedef {{
 *  site_name: string,
 *  deploy_id: string,
 *  deploy_url: string,
 *  logs: string,
 * }} NetlifyDeployResult
 */
