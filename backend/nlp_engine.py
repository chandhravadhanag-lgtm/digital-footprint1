import spacy
from spacy.pipeline import EntityRuler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Initialize spaCy model with en_core_web_sm
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    # Graceful fallback to blank English model if load fails
    nlp = spacy.blank("en")

# Ensure an EntityRuler is configured for domain-specific entities (SKILL, EDUCATION, etc.)
if "entity_ruler" not in nlp.pipe_names:
    ruler = nlp.add_pipe("entity_ruler", before="ner" if "ner" in nlp.pipe_names else None)
else:
    ruler = nlp.get_pipe("entity_ruler")

# Define specialized pattern sets for Skills and Education
skill_patterns = [
    {"label": "SKILL", "pattern": [{"LOWER": "python"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "java"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "machine"}, {"LOWER": "learning"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "nlp"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "natural"}, {"LOWER": "language"}, {"LOWER": "processing"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "react"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "sql"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "fastapi"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "docker"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "typescript"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "javascript"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "git"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "pytorch"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "postgresql"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "data"}, {"LOWER": "structures"}]},
    {"label": "SKILL", "pattern": [{"LOWER": "deep"}, {"LOWER": "learning"}]},
]

education_patterns = [
    {"label": "EDUCATION", "pattern": [{"LOWER": "b.tech"}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "btech"}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "bachelor"}, {"LOWER": "of"}, {"LOWER": "technology"}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "b.s."}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "m.s."}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "m.tech"}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "ph.d."}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "phd"}]},
    {"label": "EDUCATION", "pattern": [{"LOWER": "computer"}, {"LOWER": "science"}]},
]

ruler.add_patterns(skill_patterns + education_patterns)

LABEL_MAPPING = {
    "GPE": "LOCATION",
    "LOC": "LOCATION",
    "ORG": "ORGANIZATION",
    "PERSON": "PERSON",
    "DATE": "DATE",
    "SKILL": "SKILL",
    "EDUCATION": "EDUCATION",
}

def extract_entities(text: str):
    """
    Runs spaCy NLP NER and custom EntityRuler extraction on text.
    Returns list of entities with text, label, offsets, and confidence.
    """
    if not text:
        return []

    doc = nlp(text)
    entities = []
    seen = set()

    for ent in doc.ents:
        mapped_label = LABEL_MAPPING.get(ent.label_, ent.label_)
        key = (ent.text.strip().lower(), mapped_label)
        if key not in seen and mapped_label in ["PERSON", "ORGANIZATION", "EDUCATION", "LOCATION", "SKILL", "DATE"]:
            seen.add(key)
            # Assign reasonable confidence score based on rule match vs statistical ner
            conf = 0.95 if ent.label_ in ["SKILL", "EDUCATION"] else 0.89
            entities.append({
                "text": ent.text.strip(),
                "label": mapped_label,
                "start_char": ent.start_char,
                "end_char": ent.end_char,
                "confidence": conf
            })

    # Supplementary regex for common education/university patterns if not caught
    if not any(e["label"] == "EDUCATION" for e in entities):
        edu_match = re.search(r"\b(B\.?Tech|Bachelor\s+(?:of\s+)?[\w\s]+|M\.?S\.|Master\s+(?:of\s+)?[\w\s]+|Degree)\b", text, re.IGNORECASE)
        if edu_match:
            entities.append({
                "text": edu_match.group(0).strip(),
                "label": "EDUCATION",
                "start_char": edu_match.start(),
                "end_char": edu_match.end(),
                "confidence": 0.92
            })

    return entities

def extract_keywords(text: str, top_n: int = 8):
    """
    Uses scikit-learn TfidfVectorizer to extract top-N keywords from text.
    """
    if not text or len(text.split()) < 3:
        return []

    try:
        tfidf = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=50)
        matrix = tfidf.fit_transform([text])
        feature_names = tfidf.get_feature_names_out()
        scores = matrix.toarray()[0]
        
        ranked = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)
        return [{"keyword": k, "score": round(float(s), 3)} for k, s in ranked[:top_n]]
    except Exception:
        # Fallback to simple token frequency
        words = [w.lower() for w in re.findall(r'\b[A-Za-z]{3,}\b', text)]
        counts = {}
        for w in words:
            counts[w] = counts.get(w, 0) + 1
        sorted_words = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return [{"keyword": k, "score": round(min(1.0, count / 5.0), 3)} for k, count in sorted_words[:top_n]]

def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculates cosine similarity between two text snippets using scikit-learn TF-IDF.
    """
    if not text1 or not text2:
        return 0.0
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([text1, text2])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return round(float(sim), 3)
    except Exception:
        return 0.5
