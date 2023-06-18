const Constants = {
  interactions: {
    none: 0,
    like: 1,
    dislike: -1,
  },
};

export function PostObject(post, likeCount, dislikeCount, interaction, comments, author, id) {
  return {
    post: post,
    likeCount: likeCount,
    dislikeCount: dislikeCount,
    interaction: interaction,
    comments: comments,
    author: author,
    id: id,
  };
}

export function CommentObject(comment, likeCount, dislikeCount, interaction, author, id) {
  return {
    comment: comment,
    likeCount: likeCount,
    dislikeCount: dislikeCount,
    interaction: interaction,
    author: author,
    id: id,
  };
}

export default Constants;
