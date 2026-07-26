import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Result() {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data.interview);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;

  if (!interview) return <h2>Interview not found</h2>;

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Interview Result 🎉</h1>

      <h2>Overall Score: {interview.score}/100</h2>

      <p>
        <strong>Summary:</strong>
      </p>

      <p>{interview.summary}</p>

      <hr />

      {interview.questions.map((q, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <h3>
            Question {index + 1}
          </h3>

          <p>
            <strong>Question:</strong>
          </p>

          <p>{q.question}</p>

          <p>
            <strong>Your Answer:</strong>
          </p>

          <p>{q.answer || "No answer submitted."}</p>

          <p>
            <strong>Score:</strong> {q.score}/10
          </p>

          <p>
            <strong>AI Feedback:</strong>
          </p>

          <p>{q.feedback}</p>

          <p>
            <strong>Ideal Answer:</strong>
          </p>

          <p>{q.idealAnswer}</p>
        </div>
      ))}
    </div>
  );
}

export default Result;