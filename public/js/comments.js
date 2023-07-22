// grab the HTML elements using DOM Manipulation
const addCommentForm = document.getElementById('add-comment-form');
const commentArticleIDInput = document.getElementById('comment-article-id');
const commentArea = document.getElementById('comment-area');
const commentsContainer = document.getElementById('comments-container');
const commentsCountElement = document.getElementById('comments-count');
// If the form to add a comment exists (i.e: a user is logged in)
if (addCommentForm) {
    addCommentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // utilize access to post the data to the database and use the response to update the DOM without page refreshing
        axios
            .post('/article/comment', {
                articleID: commentArticleIDInput.value,
                comment: commentArea.value,
            })
            .then(function (response) {
                let { comment, commentAuthor, commentsCount, commentDate } = response.data;
                const commentContainerElement = document.createElement('div');
                const commentAuthorElement = document.createElement('div');
                const commentDateElement = document.createElement('div');
                const separator = document.createElement('hr');
                const commentTextElement = document.createElement('div');

                commentAuthorElement.textContent = commentAuthor;
                commentAuthorElement.className = 'text-gray-400 text-lg font-medium';

                commentDateElement.textContent = commentDate;
                commentDateElement.className = 'text-gray-400 text-sm';

                separator.className = 'h-px my-2 bg-gray-200';

                commentTextElement.textContent = comment;
                commentTextElement.className = 'mt-4';

                commentsCountElement.textContent = commentsCount;

                commentContainerElement.className = 'container single-comment-container mt-4 mb-4 mx-auto bg-gray-50 rounded-md p-4';
                commentContainerElement.append(commentAuthorElement);
                commentContainerElement.append(commentDateElement);
                commentContainerElement.append(separator);

                commentContainerElement.append(commentTextElement);

                commentsContainer.append(commentContainerElement);
            })
            .catch(function (error) {
                return new Error(error);
            });
        commentArea.value = '';
    });
}
