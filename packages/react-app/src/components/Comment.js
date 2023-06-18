import {
  DeleteRounded,
  ThumbDownRounded,
  ThumbUpRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import Constants from "../pages/Constants";

export default function Comment({ comment, commentId, removeCommentCallback }) {
  let [interaction, setInteraction] = useState(Constants.interactions.none);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-sm">{comment.comment}</div>
      <div className="flex flex-row items-center">
        <div className="font-medium text-slate-600 mr-2">
          {comment.likeCount - comment.dislikeCount + interaction}
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
            fontSize="small"
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
            fontSize="small"
            color={
              interaction === Constants.interactions.dislike ? "error" : "none"
            }
          />
        </IconButton>
        {comment.author !== "me" ? null : (
          <IconButton onClick={() => removeCommentCallback(commentId)}>
            <DeleteRounded fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  );
}
