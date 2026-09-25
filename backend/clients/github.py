import httpx
from typing import Dict, Any, Optional

GITHUB_API_URL = "https://api.github.com"
USER_AGENT = "DigitalFootprintAnalyzer/2.0"

def search_github_profile(name: str, location: Optional[str] = None, org: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Searches GitHub Public Users API for a person matching the full name.
    """
    if not name or not name.strip():
        return None

    clean_name = name.strip()
    query = f"{clean_name} in:name"
    if location and location.strip():
        query += f" location:{location.strip()}"

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/vnd.github.v3+json"
    }

    try:
        with httpx.Client(timeout=8.0) as client:
            resp = client.get(f"{GITHUB_API_URL}/search/users", params={"q": query, "per_page": 5}, headers=headers)
            if resp.status_code == 200:
                items = resp.json().get("items", [])
                if items:
                    # Pick top matched user and inspect full profile
                    username = items[0].get("login")
                    user_resp = client.get(f"{GITHUB_API_URL}/users/{username}", headers=headers)
                    if user_resp.status_code == 200:
                        u = user_resp.json()
                        return {
                            "username": username,
                            "url": u.get("html_url", f"https://github.com/{username}"),
                            "name": u.get("name"),
                            "bio": u.get("bio"),
                            "company": u.get("company"),
                            "location": u.get("location"),
                            "blog": u.get("blog"),
                            "avatar_url": u.get("avatar_url"),
                            "public_repos": u.get("public_repos", 0),
                            "followers": u.get("followers", 0),
                            "source": "GitHub Public API"
                        }
    except Exception as e:
        print(f"GitHub search error for {name}: {e}")

    return None
