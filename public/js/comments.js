const addCommentForm = document.getElementById('add-comment-form');
const commentArticleIDInput = document.getElementById('comment-article-id');
const commentArea = document.getElementById('comment-area');
const commentsContainer = document.getElementById('comments-container');
const commentsCountElement = document.getElementById('comments-count');
if (addCommentForm) {
    addCommentForm.addEventListener('submit', (e) => {
        e.preventDefault();
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

                separator.className = 'h-px my-2 bg-gray-200 border-0 dark:bg-gray-700';

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
                console.log(error);
            });
        commentArea.value = '';
    });
}