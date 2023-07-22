// grab the HTML elements using DOM Manipulation
const elem = document.getElementById('likes-interact-form');
const inputArticleID = document.getElementById('article-id-interact');
const submitBtn = document.getElementById('submit-btn');
let operation = '';
let totalLikes = document.getElementById('total-likes');

// Ensure the totalLikesCount is an integer to manipulate it when a new like is added/removed
totalLikesCount = parseInt(totalLikes.textContent);

// if the like button exists (i.e: a user is logged in)
if (elem) {
    elem.addEventListener('submit', (e) => {
        e.preventDefault();
        operation = submitBtn.value;
        // utilize access to post the data to the database and use the response to update the DOM without page refreshing
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
                // If there is only 1 like, display the text as "1 Like", else: display the text as "<count> Likes"
                totalLikes.textContent = totalLikesCount === 1 ? totalLikesCount + ' Like' : totalLikesCount + ' Likes';
            })
            .catch(function (error) {
                return new Error(error);
            });
    });
}
