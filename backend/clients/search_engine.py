import os
import re
import urllib.parse
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional

BRAVE_API_KEY = os.getenv("BRAVE_API_KEY", "").strip()
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

def search_brave(query: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Queries the official Brave Search API using the BRAVE_API_KEY environment variable.
    """
    if not BRAVE_API_KEY:
        return []

    url = "https://api.search.brave.com/res/v1/web/search"
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": BRAVE_API_KEY
    }
    params = {"q": query, "count": count}

    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data.get("web", {}).get("results", []):
                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("url", ""),
                        "snippet": item.get("description", ""),
                        "source": "Brave Search API",
                        "age": item.get("page_age")
                    })
                return results
    except Exception as e:
        print(f"Brave Search API query failed: {e}")
    return []

def search_fallback(query: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Resilient web search fallback using public search result parsing.
    Guarantees dynamic results even when no Brave Search API key is supplied.
    """
    url = "https://html.duckduckgo.com/html/"
    headers = {"User-Agent": USER_AGENT}
    data = {"q": query}

    try:
        with httpx.Client(timeout=10.0, follow_redirects=True) as client:
            resp = client.post(url, data=data, headers=headers)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                results = []
                for result in soup.select(".result"):
                    title_elem = result.select_one(".result__title a")
                    snippet_elem = result.select_one(".result__snippet")
                    url_elem = result.select_one(".result__url")

                    if title_elem and title_elem.get("href"):
                        raw_href = title_elem.get("href", "")
                        # Decode DDG redirect url
                        actual_url = raw_href
                        if "uddg=" in raw_href:
                            try:
                                parsed = urllib.parse.parse_qs(urllib.parse.urlparse(raw_href).query)
                                actual_url = parsed.get("uddg", [raw_href])[0]
                            except Exception:
                                pass

                        title = title_elem.get_text(strip=True)
                        snippet = snippet_elem.get_text(strip=True) if snippet_elem else ""

                        results.append({
                            "title": title,
                            "url": actual_url,
                            "snippet": snippet,
                            "source": "Web Search (Public Index)"
                        })
                        if len(results) >= count:
                            break
                return results
    except Exception as e:
        print(f"Web search fallback failed for '{query}': {e}")
    return []

def execute_search(query: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Tries Brave Search API first; gracefully falls back to public web search.
    """
    results = search_brave(query, count)
    if not results:
        results = search_fallback(query, count)
    return results

def run_dynamic_searches(
    name: str, 
    location: Optional[str] = None, 
    organization: Optional[str] = None
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Constructs and executes the dynamically tailored queries requested:
    - "{name}" biography
    - "{name}" profession
    - "{name}" date of birth
    - "{name}" LinkedIn
    - "{name}" GitHub
    - "{name}" Instagram
    - "{name}" X
    - "{name}" official website
    Incorporates optional location/organization to sharpen accuracy.
    """
    clean_name = name.strip()
    context = ""
    if organization and organization.strip():
        context += f" {organization.strip()}"
    if location and location.strip():
        context += f" {location.strip()}"

    search_targets = {
        "biography": f'"{clean_name}" biography{context}',
        "profession": f'"{clean_name}" profession{context}',
        "dob": f'"{clean_name}" date of birth',
        "linkedin": f'"{clean_name}" LinkedIn{context}',
        "github": f'"{clean_name}" GitHub',
        "instagram": f'"{clean_name}" Instagram',
        "x_twitter": f'"{clean_name}" X twitter{context}',
        "website": f'"{clean_name}" official website{context}',
        "news": f'"{clean_name}" news{context}',
    }

    aggregated_results: Dict[str, List[Dict[str, Any]]] = {}

    for category, query in search_targets.items():
        res = execute_search(query, count=3)
        aggregated_results[category] = res

    return aggregated_results
