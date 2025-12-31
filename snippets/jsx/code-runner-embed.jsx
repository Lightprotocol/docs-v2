export const CodeRunnerEmbed = ({ example, height = "450px" }) => {
  const baseUrl = process.env.CODE_RUNNER_URL || "http://localhost:3030";
  return (
    <iframe
      src={`${baseUrl}/embed/${example}`}
      style={{
        width: "100%",
        height: height,
        border: "none",
        borderRadius: "8px",
        overflow: "hidden",
      }}
      allow="clipboard-write"
      title={`${example} code example`}
    />
  );
};

