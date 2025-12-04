from fastapi import APIRouter
from pydantic import BaseModel
from transformers import pipeline

# Create a router object to be included inside main.py
router = APIRouter()

# ---------------------------------------------------------
# Initialize the HuggingFace translation pipeline
# ---------------------------------------------------------
# "translation_en_to_fr" = task for English → French
# model="Helsinki-NLP/opus-mt-en-fr" = translation model
# device=-1 → use CPU (0 = GPU if available)
translator = None

def get_translator():
    global translator
    if translator is None:
        translator_local = pipeline(
            "translation_en_to_fr",
            model="Helsinki-NLP/opus-mt-en-fr",
            device=-1,
        )
        globals()["translator"] = translator_local
    return translator

# ---------------------------------------------------------
# Pydantic model: structure of request body
# ---------------------------------------------------------
class TextInput(BaseModel):
    text: str  # The input text to translate


# ---------------------------------------------------------
# Function: Split long text into multiple safe chunks
# ---------------------------------------------------------
def split_into_chunks(text, max_length=400):
    """
    MarianMT models (like opus-mt-en-fr) have a token limit.
    If the text is too long, the translation will be cut or incomplete.

    This function splits the text into smaller chunks based on sentences.
    Each chunk is kept under `max_length` characters.

    Why 400?
    - Safe value below the ~512 token limit of MarianMT.
    """

    # Split by sentence using ". " (simple but effective)
    sentences = text.split(". ")

    chunks = []          # list of text chunks
    current_chunk = ""   # chunk being built

    # Loop through each sentence
    for sentence in sentences:
        sentence = sentence.strip()

        # Skip empty sentences (avoid errors)
        if not sentence:
            continue

        # If adding the next sentence exceeds max_length,
        # we finalize the current chunk and start a new one.
        if len(current_chunk) + len(sentence) + 2 > max_length:
            chunks.append(current_chunk.strip())  # save chunk
            current_chunk = sentence + ". "        # start new chunk
        else:
            # Otherwise, add the sentence to current chunk
            current_chunk += sentence + ". "

    # Append last remaining chunk if exists
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


# ---------------------------------------------------------
# Function: Translate long text in multiple chunks
# ---------------------------------------------------------
def translate_long_text(text):
    """
    This function:
    1. Splits the text into chunks
    2. Translates each chunk separately
    3. Combines the translated chunks back together
    """

    # Step 1: Split into safe chunks
    chunks = split_into_chunks(text)

    translations = []  # collect translations

    translation_pipeline = get_translator()

    # Step 2: Translate each chunk one by one
    for chunk in chunks:
        result = translation_pipeline(chunk)
        translations.append(result[0]["translation_text"])

    # Step 3: Reassemble all translated parts into one text
    final_text = " ".join(translations)

    return final_text


# ---------------------------------------------------------
# API Endpoint: POST /translate
# ---------------------------------------------------------
@router.post("/")
def translate_text(input: TextInput):
    """
    Receives JSON:
    {
        "text": "some long english text..."
    }

    Returns:
    {
        "translation": "translated french text"
    }
    """
    
    # Translate using our safe method
    final_translation = translate_long_text(input.text)

    return {"translation": final_translation}
