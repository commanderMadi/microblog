const elem = document.getElementById('likes-interact-form');
const inputArticleID = document.getElementById('article-id-interact');
const submitBtn = document.getElementById('submit-btn');
let operation = '';
let totalLikes = document.getElementById('total-likes');
totalLikesCount = parseInt(totalLikes.textContent);

if (elem) {
    elem.addEventListener('submit', (e) => {
        e.preventDefault();
        operation = submitBtn.value;
        axios
            .post('/article/interact', {
                articleID: inputArticleID.value,
                likesCount: totalLikesCount,
                operation,
            })
            .then(function (response) {
                if (totalLikesCount <= response.data.numericLikeCount) {
                    submitBtn.value = 'Unlike';
                } else {
                    submitBtn.value = 'Like';
                }
                totalLikesCount = response.data.numericLikeCount;
                totalLikes.textContent = totalLikesCount === 1 ? totalLikesCount + ' Like' : totalLikesCount + ' Likes';
            })
            .catch(function (error) {
                return new Error(error);
            });
    });
}
