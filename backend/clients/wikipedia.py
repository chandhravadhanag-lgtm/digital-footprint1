import httpx
from typing import Dict, Any, Optional

USER_AGENT = "DigitalFootprintAnalyzer/2.0 (academic; https://github.com/academic/footprint-analyzer)"

def get_wikipedia_summary(title_or_name: str) -> Optional[Dict[str, Any]]:
    """
    Fetches Wikipedia page summary, extract, desktop URL, and thumbnail for a person.
    """
    if not title_or_name or not title_or_name.strip():
        return None

    clean_title = title_or_name.strip().replace(" ", "_")

    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{clean_title}"
        headers = {"User-Agent": USER_AGENT}
        with httpx.Client(timeout=8.0) as client:
            resp = client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("type") in ["standard", "disambiguation"]:
                    return {
                        "title": data.get("title"),
                        "description": data.get("description"),
                        "extract": data.get("extract"),
                        "url": data.get("content_urls", {}).get("desktop", {}).get("page"),
                        "thumbnail": data.get("thumbnail", {}).get("source"),
                        "source": "Wikipedia"
                    }
            elif resp.status_code == 404:
                # Try OpenSearch fallback to find closest page title
                search_url = "https://en.wikipedia.org/w/api.php"
                params = {
                    "action": "opensearch",
                    "search": title_or_name.strip(),
                    "limit": 1,
                    "namespace": 0,
                    "format": "json"
                }
                search_resp = client.get(search_url, params=params, headers=headers)
                if search_resp.status_code == 200:
                    results = search_resp.json()
                    titles = results[1] if len(results) > 1 else []
                    if titles:
                        return get_wikipedia_summary(titles[0])
    except Exception as e:
        print(f"Wikipedia summary error for {title_or_name}: {e}")

    return None
