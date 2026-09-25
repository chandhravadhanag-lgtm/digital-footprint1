import httpx
from typing import List, Dict, Any, Optional

WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php"
USER_AGENT = "DigitalFootprintAnalyzer/2.0 (academic; https://github.com/academic/footprint-analyzer)"

# Common Wikidata Property IDs
PROPERTY_MAP = {
    "P569": "date_of_birth",
    "P106": "occupation",
    "P108": "employer",
    "P69": "educated_at",
    "P856": "official_website",
    "P2002": "twitter_handle",
    "P2003": "instagram_handle",
    "P2013": "facebook_id",
    "P2397": "youtube_channel_id",
    "P2035": "linkedin_id",
    "P2037": "github_username",
    "P27": "country_of_citizenship",
    "P19": "place_of_birth",
}

def search_wikidata_entities(query: str, limit: int = 7) -> List[Dict[str, Any]]:
    """
    Search Wikidata for entities matching the name.
    Returns list of candidate objects with id, label, description, and match score.
    """
    if not query or not query.strip():
        return []

    try:
        params = {
            "action": "wbsearchentities",
            "search": query.strip(),
            "language": "en",
            "format": "json",
            "limit": limit,
            "type": "item"
        }
        headers = {"User-Agent": USER_AGENT}
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(WIKIDATA_API_URL, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("search", []):
                    desc = item.get("description", "")
                    # Filter out non-person items when obvious (e.g. podcast episodes, films) unless label is close
                    results.append({
                        "id": item.get("id"),
                        "label": item.get("label"),
                        "description": desc,
                        "url": item.get("concepturi", f"https://www.wikidata.org/wiki/{item.get('id')}"),
                        "source": "Wikidata"
                    })
                return results
    except Exception as e:
        print(f"Wikidata search error: {e}")
    return []

def get_entity_details(entity_id: str) -> Dict[str, Any]:
    """
    Retrieves full property claims and resolved labels for a specific Wikidata entity ID.
    """
    try:
        params = {
            "action": "wbgetentities",
            "ids": entity_id,
            "languages": "en",
            "props": "claims|labels|descriptions|sitelinks",
            "format": "json"
        }
        headers = {"User-Agent": USER_AGENT}
        with httpx.Client(timeout=12.0) as client:
            resp = client.get(WIKIDATA_API_URL, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                entity = data.get("entities", {}).get(entity_id, {})
                claims = entity.get("claims", {})
                
                # Extract Wikipedia article title if available
                sitelinks = entity.get("sitelinks", {})
                enwiki = sitelinks.get("enwiki", {}).get("title")

                # Extract claims
                extracted_data: Dict[str, Any] = {
                    "id": entity_id,
                    "label": entity.get("labels", {}).get("en", {}).get("value"),
                    "description": entity.get("descriptions", {}).get("en", {}).get("value"),
                    "wikipedia_title": enwiki,
                    "wikidata_url": f"https://www.wikidata.org/wiki/{entity_id}",
                    "date_of_birth": None,
                    "occupations": [],
                    "employers": [],
                    "education": [],
                    "official_website": None,
                    "social_links": {},
                    "country": None,
                    "place_of_birth": None
                }

                # Helper to collect Q-item IDs to resolve in batch
                q_ids_to_resolve = set()

                # 1. Date of Birth (P569)
                if "P569" in claims:
                    dob_val = claims["P569"][0].get("mainsnak", {}).get("datavalue", {}).get("value", {})
                    time_str = dob_val.get("time") if isinstance(dob_val, dict) else None
                    if time_str:
                        # Extract YYYY-MM-DD or YYYY
                        clean_date = time_str.lstrip("+").split("T")[0]
                        extracted_data["date_of_birth"] = clean_date

                # 2. Official Website (P856)
                if "P856" in claims:
                    web_val = claims["P856"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if web_val and isinstance(web_val, str):
                        extracted_data["official_website"] = web_val

                # 3. Social Handles (Twitter/X P2002, Instagram P2003, Facebook P2013, YouTube P2397, LinkedIn P2035, GitHub P2037)
                if "P2002" in claims:
                    handle = claims["P2002"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if handle:
                        extracted_data["social_links"]["x"] = f"https://x.com/{handle}"
                if "P2003" in claims:
                    handle = claims["P2003"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if handle:
                        extracted_data["social_links"]["instagram"] = f"https://instagram.com/{handle}"
                if "P2013" in claims:
                    handle = claims["P2013"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if handle:
                        extracted_data["social_links"]["facebook"] = f"https://facebook.com/{handle}"
                if "P2397" in claims:
                    channel = claims["P2397"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if channel:
                        extracted_data["social_links"]["youtube"] = f"https://youtube.com/channel/{channel}"
                if "P2035" in claims:
                    handle = claims["P2035"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if handle:
                        extracted_data["social_links"]["linkedin"] = f"https://linkedin.com/in/{handle}" if not str(handle).startswith("http") else str(handle)
                if "P2037" in claims:
                    handle = claims["P2037"][0].get("mainsnak", {}).get("datavalue", {}).get("value")
                    if handle:
                        extracted_data["social_links"]["github"] = f"https://github.com/{handle}"

                # Extract entity references for Occupations (P106), Employers (P108), Education (P69), Country (P27)
                for prop_id, field_name in [("P106", "occupations"), ("P108", "employers"), ("P69", "education")]:
                    if prop_id in claims:
                        for snak in claims[prop_id]:
                            val = snak.get("mainsnak", {}).get("datavalue", {}).get("value", {})
                            if isinstance(val, dict) and "id" in val:
                                q_ids_to_resolve.add(val["id"])

                # Resolve all Q-item names to English labels
                if q_ids_to_resolve:
                    resolved_labels = resolve_wikidata_ids(list(q_ids_to_resolve))
                    if "P106" in claims:
                        for snak in claims["P106"]:
                            qid = snak.get("mainsnak", {}).get("datavalue", {}).get("value", {}).get("id")
                            if qid and qid in resolved_labels:
                                extracted_data["occupations"].append(resolved_labels[qid])
                    if "P108" in claims:
                        for snak in claims["P108"]:
                            qid = snak.get("mainsnak", {}).get("datavalue", {}).get("value", {}).get("id")
                            if qid and qid in resolved_labels:
                                extracted_data["employers"].append(resolved_labels[qid])
                    if "P69" in claims:
                        for snak in claims["P69"]:
                            qid = snak.get("mainsnak", {}).get("datavalue", {}).get("value", {}).get("id")
                            if qid and qid in resolved_labels:
                                extracted_data["education"].append(resolved_labels[qid])

                return extracted_data
    except Exception as e:
        print(f"Wikidata detail error for {entity_id}: {e}")
    return {}

def resolve_wikidata_ids(q_ids: List[str]) -> Dict[str, str]:
    """
    Given a list of Q-IDs (e.g. ['Q4830453', 'Q95']), resolves their English labels.
    """
    if not q_ids:
        return {}
    try:
        params = {
            "action": "wbgetentities",
            "ids": "|".join(q_ids[:50]),
            "languages": "en",
            "props": "labels",
            "format": "json"
        }
        headers = {"User-Agent": USER_AGENT}
        with httpx.Client(timeout=8.0) as client:
            resp = client.get(WIKIDATA_API_URL, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                entities = data.get("entities", {})
                res = {}
                for qid, val in entities.items():
                    label = val.get("labels", {}).get("en", {}).get("value")
                    if label:
                        res[qid] = label
                return res
    except Exception as e:
        print(f"Error resolving Q IDs: {e}")
    return {}
