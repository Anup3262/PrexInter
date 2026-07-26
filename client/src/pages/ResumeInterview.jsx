import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import api from "../services/api";

function ResumeInterview() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [type, setType] = useState("Technical");
  const [questionCount, setQuestionCount] = useState(5);
  const [duration, setDuration] = useState(20);
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
      },
      multiple: false,
      onDrop,
    });

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);
      formData.append("difficulty", difficulty);
      formData.append("type", type);
      formData.append("questionCount", questionCount);
      formData.append("duration", duration);
      formData.append("role", role);

      const response = await api.post(
        "/resume/interview",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate(
        `/interview/${response.data.interview._id}`
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to create interview."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-indigo-600">
          Resume Interview
        </h1>

        <p className="mt-2 text-slate-500">
          Upload your resume and let AI create a
          personalized interview.
        </p>

        <div
          {...getRootProps()}
          className="mt-8 cursor-pointer rounded-2xl border-2 border-dashed border-indigo-400 p-12 text-center"
        >
          <input {...getInputProps()} />

          {isDragActive ? (
            <p>Drop your resume here...</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold">
                Drag & Drop Resume
              </h2>

              <p className="mt-2 text-slate-500">
                or click to browse
              </p>

              {file && (
                <p className="mt-5 font-semibold text-green-600">
                  {file.name}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="rounded-xl border p-3"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="rounded-xl border p-3"
          >
            <option>Technical</option>
            <option>HR</option>
            <option>Behavioral</option>
            <option>Mixed</option>
          </select>

          <input
            type="number"
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(e.target.value)
            }
            className="rounded-xl border p-3"
            placeholder="Questions"
          />

          <input
            type="number"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            className="rounded-xl border p-3"
            placeholder="Duration"
          />

          <input
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="rounded-xl border p-3 md:col-span-2"
            placeholder="Role (optional)"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white"
        >
          {loading
            ? "Analyzing Resume..."
            : "Generate Interview"}
        </button>

      </div>
    </main>
  );
}

export default ResumeInterview;