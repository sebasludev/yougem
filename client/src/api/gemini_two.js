export async function* streamGeminiTwo({
  model = "gemini-1.5-flash", // or gemini-1.5-pro
  contents = [],
  system_instruction = "You are a helpful assistant.",
  video_id = "_fuimO6ErKI",
} = {}) {
  let response = await fetch("http://localhost:5000/api/scriptchat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, contents, system_instruction, video_id }),
  });

  yield* streamResponseChunks(response);
}

async function* streamResponseChunks(response) {
  let buffer = "";

  const CHUNK_SEPARATOR = "\n\n";

  let processBuffer = async function* (streamDone = false) {
    while (true) {
      let flush = false;
      let chunkSeparatorIndex = buffer.indexOf(CHUNK_SEPARATOR);
      if (streamDone && chunkSeparatorIndex < 0) {
        flush = true;
        chunkSeparatorIndex = buffer.length;
      }
      if (chunkSeparatorIndex < 0) {
        break;
      }

      let chunk = buffer.substring(0, chunkSeparatorIndex);
      buffer = buffer.substring(chunkSeparatorIndex + CHUNK_SEPARATOR.length);
      chunk = chunk.replace(/^data:\s*/, "").trim();
      if (!chunk) {
        if (flush) break;
        continue;
      }
      let { error, text } = JSON.parse(chunk);
      if (error) {
        console.error(error);
        throw new Error(error?.message || JSON.stringify(error));
      }
      yield text;
      if (flush) break;
    }
  };

  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);
      yield* processBuffer();
    }
  } finally {
    reader.releaseLock();
  }

  yield* processBuffer(true);
}
