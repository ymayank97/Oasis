import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Table } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(0);

  const [allQuestions, setAllQuestions] = useState([]);

  const fetchAllQuestions = async () => {
    const questionCount = await readContracts.DelegationDAO.getQuestionCount();
    const questions = [];
    for (let i = 0; i < questionCount; i++) {
      const question = await readContracts.DelegationDAO.getQuestion(i);
      const answerCount = await readContracts.DelegationDAO.getAnswerCount(i);
      questions.push({
        key: i,
        question: question.question,
        answerCount: question.answerIds.map(id => id.toString()).length,
      });
    }
    setAllQuestions(questions);
  };

  const columns = [
    {
      title: "Question ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Answer Count",
      dataIndex: "answerCount",
      key: "answerCount",
    },
  ];

  return (
    <div>
      {/* ... rest of the code ... */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Oasis</h2>
        <h4> Questions List : {purpose}</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.DelegationDAO.askQuestion(newPurpose), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Ask Question?
          </Button>
        </div>
      </div>

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card style={{ marginTop: 32 }}>
          <div style={{ margin: 8 }}>
            <Button style={{ marginTop: 8 }} onClick={fetchAllQuestions}>
              Get All Questions
            </Button>
          </div>
          <Table columns={columns} dataSource={allQuestions} />

          <Divider />
          <h4> Write Answer</h4>
          <Input
            style={{ margin: 8 }}
            placeholder="Enter Question ID"
            type="number"
            onChange={e => setSelectedQuestionId(e.target.value)}
          />
          <Input
            style={{ margin: 8 }}
            placeholder="Enter your answer here"
            onChange={e => setNewAnswer(e.target.value)}
          />
          <Button
            style={{ marginTop: 14 }}
            onClick={async () => {
              const result = tx(writeContracts.DelegationDAO.answerQuestion(selectedQuestionId, newAnswer), update => {
                console.log("📡 Answer added:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Answer " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
                console.log("awaiting metamask/web3 confirm result...", result);
              });
              console.log("awaiting metamask/web3 confirm result...", result);

              console.log("RESDDDDDDDDDDDDDDD: ", await result);
            }}
          >
            Answer Question
          </Button>
        </Card>
      </div>
    </div>
  );
}
