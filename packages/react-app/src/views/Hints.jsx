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

  const [allQuestions, setAllQuestions] = useState([]);

  const fetchAllQuestions = async () => {
    const questionCount = await readContracts.DelegationDAO.getQuestionCount();
    const questions = [];
    for (let i = 0; i < questionCount; i++) {
      const question = await readContracts.DelegationDAO.getQuestion(i);
      questions.push({
        key: i,
        question: question.question,
        asker: question.asker,
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
      title: "Asker",
      dataIndex: "asker",
      key: "asker",
    },
  ];

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
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
              All Questions!
            </Button>
          </div>
          <Table columns={columns} dataSource={allQuestions} />
        </Card>
      </div>
    </div>
  );
}
