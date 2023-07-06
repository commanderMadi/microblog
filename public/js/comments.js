const addCommentForm = document.getElementById('add-comment-form');
const commentArticleIDInput = document.getElementById('comment-article-id');
const commentArea = document.getElementById('comment-area');
const commentsContainer = document.getElementById('comments-container');
if (addCommentForm) {
    addCommentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        axios
            .post('/article/comment', {
                articleID: commentArticleIDInput.value,
                comment: commentArea.value,
            })
            .then(function (response) {
                console.log(response.data);
                const { comment, commentAuthor } = response.data;
                const commentContainerElement = document.createElement('div');
                const commentAuthorElement = document.createElement('span');
                const commentTextElement = document.createElement('span');
                commentAuthorElement.textContent = commentAuthor;
                commentTextElement.textContent = comment;
                commentContainerElement.innerHTML = `${commentAuthorElement.innerHTML}: ${commentTextElement.innerHTML}`;
                commentsContainer.append(commentContainerElement);
            })
            .catch(function (error) {
                console.log(error);
            });
        commentArea.value = '';
    });
}
