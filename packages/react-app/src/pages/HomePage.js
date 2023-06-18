import { Send } from "@mui/icons-material";
import { IconButton, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";
import Post from "../components/Post";
import Constants, { PostObject } from "./Constants";
import { useMetaMask } from "metamask-react";

export default function HomePage() {
  let [posts, setPosts] = useState([]);
  let [statement, setStatement] = useState("");

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const handleSubmitQuery = () => {
    if (!statement) return;
    setPosts(old => [...old, PostObject(statement, 0, 0, Constants.interactions.none, [], "me", null)]);
    setStatement("");
  };

  return status !== "connected" ? (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <div className="mt-8 font-black text-6xl text-purple-600">OASIS</div>
        <div className="text-slate-400 text-lg">
          {status === "initializing"
            ? "Initializing..."
            : status === "unavailable"
            ? "Error: MetaMask not available."
            : status === "connecting"
            ? "Connecting..."
            : "Speak your mind."}
        </div>
        {status !== "notConnected" ? null : (
          <button onClick={connect} className="px-4 py-2 rounded-xl mt-2 text-white bg-purple-700 font-semibold">
            Connect to MetaMask
          </button>
        )}
      </div>
    </div>
  ) : (
    <main className="flex flex-col min-h-screen items-center gap-8 m-8">
      {/* Title */}
      <div className="flex flex-col items-center gap-2">
        <div className="mt-8 font-black text-6xl text-purple-600">OASIS</div>
        <div className="text-slate-400 text-lg">Speak your mind.</div>
      </div>

      {/* Text box */}
      <div className="flex flex-row w-full items-center max-w-xl p-2 bg-slate-100 rounded-xl">
        <TextareaAutosize
          className="p-2 bg-transparent w-full focus:outline-none text-slate-600 resize-none"
          placeholder="Talk to the OASIS"
          value={statement}
          onChange={e => setStatement(e.target.value)}
        />
        <IconButton color="secondary" onClick={handleSubmitQuery}>
          <Send />
        </IconButton>
      </div>

      {/* Posts */}

      <div className="flex flex-col max-w-xl w-full gap-4">
        {posts.map((post, idx) => (
          <Post
            key={idx}
            post={post}
            addCommentCallback={newComment =>
              setPosts(posts =>
                posts.map((post, postIdx) =>
                  idx === postIdx ? { ...post, comments: [...post.comments, newComment] } : post,
                ),
              )
            }
            removePostCallback={() => setPosts(posts => posts.filter((_, postIdx) => postIdx !== idx))}
            removeCommentCallback={commentId =>
              setPosts(posts =>
                posts.map((post, postIdx) =>
                  postIdx !== idx
                    ? post
                    : {
                        ...post,
                        comments: post.comments.filter((_, commentIdx) => commentIdx !== commentId),
                      },
                ),
              )
            }
          />
        ))}
      </div>
    </main>
  );
}
