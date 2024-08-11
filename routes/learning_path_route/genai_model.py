from config.config import genai
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

system_instruction = "Create a learning path based on user prompt. Use the typescript interfaces to create the JSON schema. \ninterface Roadmap {\n    prompt: string; - Transform the prompt to be more abstract, in 2-3 words\n    plan:   Plan;\n}\n\ninterface Plan {\n    fundamentals: Content;\n    intermediate: Content;\n    advanced:     Content;\n}\n\ninterface Content {\n    about:  About\n    subjects:   Subject[];\n}\n\ninterface About {\n  description : Description;\n  outcomes : Outcome[]\n}\n\ninterface Description {\n   text: string;\n}\n\ninterface Outcome {\n    text: string;\n}\n\ninterface Subject {\n   text: string;\n   youtube_query: string;\n} \n If needed, TRANSLATE everyhing ",

generate_learning_path_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction=system_instruction,
)
