from typing import List, Dict, Any, Optional

# Non-human entity keywords to downrank or filter
MEDIA_DESCRIPTIONS = [
    "episode of", "podcast", "television episode", "film", "song", 
    "album", "video game", "book", "wikimedia disambiguation", "fictional character"
]

def evaluate_candidates(
    raw_candidates: List[Dict[str, Any]], 
    name: str, 
    location: Optional[str] = None, 
    organization: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Evaluates, ranks, and structures candidate profiles for identity matching and disambiguation.
    If multiple people share the exact same name, preserves their tied ranking to trigger disambiguation.
    """
    if not raw_candidates:
        return []

    scored_candidates = []
    norm_name = name.strip().lower()
    norm_loc = location.strip().lower() if location and location.strip() else None
    norm_org = organization.strip().lower() if organization and organization.strip() else None

    for c in raw_candidates:
        label = c.get("label", "")
        desc = c.get("description", "")
        norm_label = label.strip().lower()
        desc_lower = desc.lower()

        # Heavily downrank obvious non-person media items
        if any(bad in desc_lower for bad in MEDIA_DESCRIPTIONS):
            score = 10
        else:
            score = 50

            # Boost exact name equality
            if norm_label == norm_name:
                score += 40
            elif norm_name in norm_label:
                score += 15

            # Contextual boosts
            if norm_org and norm_org in f"{label} {desc}".lower():
                score += 35
            if norm_loc and norm_loc in f"{label} {desc}".lower():
                score += 25

        # Format clean profession & organization fields
        profession = "Public Individual"
        org = "Public Registry"

        if desc:
            parts = [p.strip() for p in desc.split(",")]
            profession = parts[0].capitalize()
            if len(parts) > 1:
                org = parts[1]

        scored_candidates.append({
            "candidate_id": c.get("id"),
            "display_name": label or name,
            "description": desc or "Publicly indexed individual",
            "profession": profession,
            "organization": org,
            "score": score,
            "wikidata_url": c.get("url")
        })

    # Filter out candidates with score < 20 (media items) if we have real people
    valid_people = [c for c in scored_candidates if c["score"] >= 30]
    final_list = valid_people if valid_people else scored_candidates

    # Sort descending by score
    final_list.sort(key=lambda x: x["score"], reverse=True)
    return final_list
