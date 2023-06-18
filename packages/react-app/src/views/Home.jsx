import { Card, Collapse, Typography, Divider, Tag, Spin } from "antd";
import { useEffect } from "react";
import React, { useState } from "react";

const { Panel } = Collapse;
const { Title } = Typography;

export default function HomePage({ readContracts }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllQuestions = async () => {
    const questionCount = await readContracts.DelegationDAO.getQuestionCount();
    const questions = [];
    for (let i = 0; i < questionCount; i++) {
      const question = await readContracts.DelegationDAO.getQuestion(i);
      const answers = await Promise.all(question.answerIds.map(id => readContracts.DelegationDAO.getAnswer(id)));
      questions.push({
        key: i,
        question: question.question,
        answers: answers,
      });
    }
    setAllQuestions(questions);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "50px" }}>
      <Title style={{ textAlign: "center", color: "#003366" }}>QA Oasis</Title>
      <Divider />
      {loading ? (
        <Spin size="large" />
      ) : (
        allQuestions.map(question => (
          <Card style={{ marginBottom: "20px" }}>
            <Title level={4} style={{ color: "#003366" }}>
              {question.question}
            </Title>
            <Collapse accordion>
              {question.answers.map((answer, index) => (
                <p>{answer.answer}</p>
              ))}
            </Collapse>
          </Card>
        ))
      )}
    </div>
  );
}
