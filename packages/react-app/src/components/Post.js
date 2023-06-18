import React, { useState } from "react";
import {
  CommentRounded,
  DeleteRounded,
  Send,
  ThumbDownRounded,
  ThumbUpRounded,
} from "@mui/icons-material";
import { IconButton, TextareaAutosize } from "@mui/material";
import Constants, { CommentObject } from "../pages/Constants";
import Comment from "./Comment";

export default function Post({
  post,
  removePostCallback,
  removeCommentCallback,
  addCommentCallback,
  id,
}) {
  const [interaction, setInteraction] = useState(post.interaction);
  const [commentsAreShown, showComments] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [myComment, setMyComment] = useState("");
  const me = "me";

  const handleSendComment = () => {
    if (!myComment) return;
    setComments((old) => [...old]);
    addCommentCallback(
      CommentObject(myComment, 0, 0, Constants.interactions.none, me, null)
    );
    setMyComment("");
  };

  return (
    <div
      className={`flex flex-col bg-slate-100 rounded-xl ${
        post.author === me ? "border-purple-500 border-2" : ""
      }`}
    >
      {/* Post */}
      <div className="text-slate-800 font-medium p-4">{post.post}</div>

      {/* Reactions */}
      <div className="flex flex-row justify-end items-center p-2">
        <div className="mr-2 text-lg font-bold text-purple-600">
          {post.likeCount + interaction}
        </div>
        <IconButton
          onClick={() =>
            setInteraction(
              interaction === Constants.interactions.like
                ? Constants.interactions.none
                : Constants.interactions.like
            )
          }
        >
          <ThumbUpRounded
            color={
              interaction === Constants.interactions.like ? "primary" : "none"
            }
          />
        </IconButton>
        <IconButton
          onClick={() =>
            setInteraction(
              interaction === Constants.interactions.dislike
                ? Constants.interactions.none
                : Constants.interactions.dislike
            )
          }
        >
          <ThumbDownRounded
            color={
              interaction === Constants.interactions.dislike ? "error" : "none"
            }
          />
        </IconButton>
        <IconButton onClick={() => showComments((old) => !old)}>
          <CommentRounded />
        </IconButton>
        {post.author !== me ? null : (
          <IconButton onClick={() => removePostCallback()}>
            <DeleteRounded />
          </IconButton>
        )}
      </div>

      {/* Comments */}
      {!commentsAreShown ? null : (
        <div className="flex flex-col p-4 pt-0 gap-2">
          {post.comments.map((comment, idx) => (
            <Comment
              key={idx}
              commentId={idx}
              comment={comment}
              removeCommentCallback={(commentId) =>
                removeCommentCallback(commentId)
              }
            />
          ))}
          <div className="flex flex-row items-center mt-4 gap-2">
            <TextareaAutosize
              className="bg-transparent w-full focus:outline-none text-slate-600 italic resize-none text-sm"
              placeholder="Add a comment"
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
            />
            <IconButton onClick={handleSendComment}>
              <Send fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
